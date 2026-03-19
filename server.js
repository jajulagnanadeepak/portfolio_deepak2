// server.js

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import projectRoutes from "./routes/projectRoutes.js";
import certificationRoutes from "./routes/certificationRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
console.log("API KEY:", process.env.RESEND_API_KEY);

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
    origin: (origin, callback) => {
      const allowedOrigins = (process.env.CORS_ORIGIN || "*")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
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
   API ROUTES
===================================================== */
app.use("/", authRoutes);
app.use("/api", contactRoutes);
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