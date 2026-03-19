// server.js

import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import nodemailer from "nodemailer";

import User from "./models/user.js";
import Admin from "./models/admin.js";
import projectRoutes from "./routes/projectRoutes.js";
import certificationRoutes from "./routes/certificationRoutes.js";

dotenv.config();

const app = express();

/* =====================================================
   TRUST PROXY (Required for Render)
===================================================== */
app.set("trust proxy", 1);

/* =====================================================
   MIDDLEWARE
===================================================== */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", // allow all for now (local)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* =====================================================
   MONGODB CONNECTION
===================================================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

/* =====================================================
   NODEMAILER
===================================================== */
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_SECURE =
  process.env.SMTP_SECURE !== undefined
    ? process.env.SMTP_SECURE === "true"
    : SMTP_PORT === 465;
const SMTP_REQUIRE_TLS =
  process.env.SMTP_REQUIRE_TLS !== undefined
    ? process.env.SMTP_REQUIRE_TLS === "true"
    : !SMTP_SECURE;
const SMTP_FAMILY = Number(process.env.SMTP_FAMILY || 4);

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  requireTLS: SMTP_REQUIRE_TLS,
  family: SMTP_FAMILY,
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 25000,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: false,
  },
  pool: {
    maxConnections: 1,
    maxMessages: 5,
    rateDelta: 2000,
    rateLimit: 5,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error(
      `❌ Email transporter error (host=${SMTP_HOST}, port=${SMTP_PORT}, secure=${SMTP_SECURE}):`,
      err
    );
  } else {
    console.log("✅ Ready to send emails");
  }
});

/* =====================================================
   ADMIN OTP AUTH
===================================================== */
app.post("/auth/request-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({ success: false, msg: "Email required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    let admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      admin = new Admin({ email: normalizedEmail });
    }

    admin.otp = otp;
    admin.otpExpiresAt = expiresAt;

    await admin.save();

    console.log("SAVED OTP:", admin);

    await transporter.sendMail({
      from: `"Admin Login" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: `Your OTP is ${otp}`,
      html: `<h2>Your OTP: ${otp}</h2><p>Expires in 5 minutes</p>`,
    });

    res.json({ success: true, msg: "OTP sent" });
  } catch (err) {
    console.error("REQUEST OTP ERROR:", err);
    res.status(500).json({ success: false, msg: "OTP failed" });
  }
});

/* =====================================================
   VERIFY OTP → ISSUE JWT
===================================================== */
app.post("/auth/verify-otp", async (req, res) => {
  try {
    let { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, msg: "Email & OTP required" });
    }

    // 🔑 normalize inputs
    email = email.trim().toLowerCase();
    otp = String(otp).trim();

    const admin = await Admin.findOne({ email });

    // 🧪 DEBUG LOGS (TEMPORARY)
    console.log("INPUT EMAIL:", email);
    console.log("INPUT OTP:", otp);
    console.log("DB ADMIN:", admin);

    if (!admin) {
      return res.status(400).json({ success: false, msg: "Admin not found" });
    }

    if (!admin.otp || !admin.otpExpiresAt) {
      return res.status(400).json({ success: false, msg: "No OTP requested" });
    }

    if (new Date() > admin.otpExpiresAt) {
      return res.status(400).json({ success: false, msg: "OTP expired" });
    }

    if (admin.otp !== otp) {
      return res.status(400).json({ success: false, msg: "Invalid OTP" });
    }

    // ✅ CLEAR OTP
    admin.otp = null;
    admin.otpExpiresAt = null;
    await admin.save();

    // ✅ ISSUE JWT
    console.log("JWT_SECRET =", process.env.JWT_SECRET);
    console.log("JWT_EXPIRES_IN =", process.env.JWT_EXPIRES_IN);
    const token = jwt.sign(
      { adminId: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      msg: "Login successful",
      token,
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ success: false, msg: "Verification failed" });
  }
});

/* =====================================================
   CONTACT MESSAGE
===================================================== */
app.post("/send-message", async (req, res) => {
  try {
    const contactReceiver = process.env.MAIL_TO || process.env.EMAIL_USER;
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, msg: "All fields required" });
    }

    await new User({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    }).save();

    await transporter.sendMail({
      from: `"Portfolio" <${process.env.EMAIL_USER}>`,
      to: contactReceiver,
      subject: `📩 ${subject}`,
      text: `From: ${name} (${email})\n\n${message}`,
    });

    res.json({ success: true, msg: "Message sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Message failed" });
  }
});

/* =====================================================
   API ROUTES
===================================================== */
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/certifications", certificationRoutes);

/* =====================================================
   HEALTH CHECK
===================================================== */
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Portfolio API running" });
});

/* =====================================================
   404 HANDLER
===================================================== */
app.use((req, res) => {
  res.status(404).json({ success: false, msg: "Route not found" });
});

/* =====================================================
   SERVER START
===================================================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* =====================================================
   GRACEFUL SHUTDOWN
===================================================== */
process.on("SIGTERM", () => {
  mongoose.connection.close(() => {
    console.log("MongoDB closed");
    process.exit(0);
  });
});