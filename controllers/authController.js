import jwt from "jsonwebtoken";

import Admin from "../models/admin.js";

const emailServicePlaceholder = {
  success: false,
  message: "Email service not configured yet",
};

export const requestOtp = async (req, res) => {
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

    return res.status(503).json({
      success: false,
      msg: "OTP mail service not configured yet",
      ...emailServicePlaceholder,
    });
  } catch (err) {
    console.error("REQUEST OTP ERROR:", err);
    return res.status(500).json({ success: false, msg: "OTP failed" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, msg: "Email & OTP required" });
    }

    email = email.trim().toLowerCase();
    otp = String(otp).trim();

    const admin = await Admin.findOne({ email });

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

    admin.otp = null;
    admin.otpExpiresAt = null;
    await admin.save();

    console.log("JWT_SECRET =", process.env.JWT_SECRET);
    console.log("JWT_EXPIRES_IN =", process.env.JWT_EXPIRES_IN);
    const token = jwt.sign(
      { adminId: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.json({
      success: true,
      msg: "Login successful",
      token,
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({ success: false, msg: "Verification failed" });
  }
};
