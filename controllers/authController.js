import jwt from "jsonwebtoken";
import { Resend } from "resend";
import Admin from "../models/admin.js";

const resend = new Resend(process.env.RESEND_API_KEY);

// =========================
// REQUEST OTP
// =========================
export const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
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

    console.log("OTP GENERATED:", otp);

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is missing. Unable to send OTP email.");
      return res.status(500).json({
        success: false,
        msg: "Email service is not configured"
      });
    }

    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: normalizedEmail,
      subject: "Your OTP Code",
      html: `<h2>Your OTP is: ${otp}</h2>`
    });

    if (error) {
      console.error("Email error:", error);
      return res.status(500).json({
        success: false,
        msg: "Failed to send OTP"
      });
    }

    return res.json({
      success: true,
      msg: "OTP sent successfully"
    });

  } catch (err) {
    console.error("OTP ERROR:", err);
    return res.status(500).json({
      success: false,
      msg: "Server error"
    });
  }
};

// =========================
// VERIFY OTP
// =========================
export const verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        msg: "Email & OTP required"
      });
    }

    email = email.trim().toLowerCase();
    otp = String(otp).trim();

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        success: false,
        msg: "Admin not found"
      });
    }

    if (!admin.otp || !admin.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        msg: "No OTP requested"
      });
    }

    if (new Date() > admin.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        msg: "OTP expired"
      });
    }

    if (admin.otp !== otp) {
      return res.status(400).json({
        success: false,
        msg: "Invalid OTP"
      });
    }

    // clear OTP
    admin.otp = null;
    admin.otpExpiresAt = null;
    await admin.save();

    const token = jwt.sign(
      { adminId: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      msg: "Login successful",
      token
    });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({
      success: false,
      msg: "Verification failed"
    });
  }
};