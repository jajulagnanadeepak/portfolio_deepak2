// server.js

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import nodemailer from "nodemailer";
import User from "./models/user.js"; 
import Admin from "./models/admin.js";
import { v4 as uuidv4 } from "uuid";
import projectRoutes from "./routes/projectRoutes.js";         
import certificationRoutes from "./routes/certificationRoutes.js"; 

dotenv.config();

const app = express();

// Middleware with increased limit for larger payloads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// MongoDB Connection with better error handling (removed deprecated options)
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Email transporter error:", err);
  } else {
    console.log("✅ Ready to send emails");
  }
});

// =================================================================
// ✅ ADMIN OTP AUTH
// =================================================================
app.post("/auth/request-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.trim() || !emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, msg: "Valid email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const admin = await Admin.findOneAndUpdate(
      { email: normalizedEmail },
      { email: normalizedEmail, otp, otpExpiresAt: expiresAt },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: `"Admin Login" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: `Your admin OTP is ${otp}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:16px auto;padding:20px;border:1px solid #eee;border-radius:12px;background:#0e0f12;color:#e8eaf1;">
          <h2 style="margin:0 0 8px 0;color:#fff;">Admin Login Verification</h2>
          <p style="margin:0 0 14px 0;color:#b9c0d4;">Use the OTP below to complete your login. It expires in <strong>5 minutes</strong>.</p>
          <div style="font-size:32px;letter-spacing:6px;font-weight:800;background:#141722;border:1px solid #232531;border-radius:10px;padding:14px 18px;text-align:center;color:#7cd3ff;">${otp}</div>
          <p style="margin:14px 0 0 0;color:#9aa3b2;font-size:12px;">If you didn’t request this, you can ignore this email.</p>
        </div>
      `,
    });

    res.json({ success: true, msg: "OTP sent to email" });
  } catch (err) {
    console.error("❌ Error sending OTP:", err);
    res.status(500).json({ success: false, msg: "Failed to send OTP" });
  }
});

app.post("/auth/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email?.trim() || !otp?.trim()) {
      return res.status(400).json({ success: false, msg: "Email and OTP are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin || !admin.otp || !admin.otpExpiresAt) {
      return res.status(400).json({ success: false, msg: "Invalid request" });
    }

    if (new Date() > new Date(admin.otpExpiresAt)) {
      return res.status(400).json({ success: false, msg: "OTP expired" });
    }

    if (admin.otp !== otp.trim()) {
      return res.status(400).json({ success: false, msg: "Incorrect OTP" });
    }

    // Clear OTP after successful verification
    admin.otp = undefined;
    admin.otpExpiresAt = undefined;
    await admin.save();

    const sessionToken = uuidv4();
    res.json({ success: true, msg: "OTP verified", token: sessionToken });
  } catch (err) {
    console.error("❌ Error verifying OTP:", err);
    res.status(500).json({ success: false, msg: "Failed to verify OTP" });
  }
});

// =================================================================
// ✅ MESSAGE ROUTE (KEPT IN SERVER.JS)
// =================================================================
app.post("/send-message", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Input validation
        if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
            return res.status(400).json({ success: false, msg: "All fields are required" });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) { // Added .trim() here for consistency
            return res.status(400).json({ success: false, msg: "Invalid email format" });
        }
        
        // Sanitize inputs by trimming whitespace
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedSubject = subject.trim();
        const trimmedMessage = message.trim();

        // Save in DB
        const newUser = new User({ 
            name: trimmedName, 
            email: trimmedEmail, 
            subject: trimmedSubject, 
            message: trimmedMessage
        });
        await newUser.save();

        // Send email notification
        await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `📩 New Message from ${trimmedName}: ${trimmedSubject}`,
            html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; max-width: 640px; margin: 24px auto; background:#0e0f12; color:#e8eaf1; border-radius:16px; overflow:hidden; box-shadow:0 12px 30px rgba(0,0,0,0.25);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #6a5af9, #00d4ff); padding: 28px 24px; text-align:center;">
                <div style="font-size:14px; letter-spacing: .12em; color:rgba(255,255,255,.9); text-transform:uppercase;">New Portfolio Message</div>
                <div style="font-size:24px; font-weight:800; margin-top:6px; color:#fff;">You've got mail ✉️</div>
              </div>

              <!-- Body -->
              <div style="padding: 24px;">
                <p style="margin:0 0 12px 0; color:#b9c0d4; font-size:15px;">A new inquiry just arrived from your contact form. Details below:</p>

                <div style="margin-top: 14px; border:1px solid #232531; background:#141722; border-radius:12px; overflow:hidden;">
                  <div style="display:flex; border-bottom:1px solid #232531;">
                    <div style="width:160px; padding:12px 14px; background:#0f1320; color:#9aa3b2; font-weight:700;">Name</div>
                    <div style="flex:1; padding:12px 14px; background:#121625; color:#e8eaf1;">${trimmedName}</div>
                  </div>
                  <div style="display:flex; border-bottom:1px solid #232531;">
                    <div style="width:160px; padding:12px 14px; background:#0f1320; color:#9aa3b2; font-weight:700;">Email</div>
                    <div style="flex:1; padding:12px 14px; background:#121625; color:#e8eaf1;">
                      <a href="mailto:${trimmedEmail}" style="color:#7cd3ff; text-decoration:none;">${trimmedEmail}</a>
                    </div>
                  </div>
                  <div style="display:flex; border-bottom:1px solid #232531;">
                    <div style="width:160px; padding:12px 14px; background:#0f1320; color:#9aa3b2; font-weight:700;">Subject</div>
                    <div style="flex:1; padding:12px 14px; background:#121625; color:#e8eaf1;">${trimmedSubject}</div>
                  </div>
                  <div style="display:block;">
                    <div style="padding:12px 14px; background:#0f1320; color:#9aa3b2; font-weight:700; border-bottom:1px solid #232531;">Message</div>
                    <div style="padding:16px 14px; background:#121625; color:#e8eaf1; line-height:1.6; white-space:pre-wrap;">${trimmedMessage}</div>
                  </div>
                </div>

                <!-- CTA -->
                <div style="text-align:center; margin-top:18px;">
                  <a href="mailto:${trimmedEmail}?subject=Re: ${encodeURIComponent(trimmedSubject)}" 
                     style="display:inline-block; padding:12px 20px; background:linear-gradient(135deg,#6a5af9,#00d4ff); color:#ffffff; text-decoration:none; font-weight:700; border-radius:10px; box-shadow:0 6px 18px rgba(0, 212, 255, 0.35);">Reply Now</a>
                </div>
            </div>
            `,
        });

        res.json({ success: true, msg: "✅ Message saved and email sent" });
    } catch (err) {
        console.error("❌ Error processing message:", err);
        // Check for MongoDB specific errors if necessary, otherwise use a generic 500
        res.status(500).json({ success: false, msg: "Internal server error: Failed to process message." });
    }
});

// API Routes
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/certifications", certificationRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Portfolio API is running..." });
});

// Error handling middleware (General internal errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  // Check for specific error types if needed, otherwise send generic 500
  res.status(err.status || 500).json({ success: false, msg: "Something broke on the server!" });
});

// Handle 404 (Must be the last route/middleware)
app.use((req, res) => {
  res.status(404).json({ success: false, msg: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Performing graceful shutdown...');
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});