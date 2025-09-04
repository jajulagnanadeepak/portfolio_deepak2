import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import nodemailer from "nodemailer";
import User from "./models/user.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // ✅ use 587 instead of 465
  secure: false, // false for TLS (true only for 465)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // your Google App Password
  },
});


// ✅ Test email transporter
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Email transporter error:", err);
  } else {
    console.log("✅ Ready to send emails");
  }
});

// ✅ POST route
app.post("/send-message", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

    // Save in DB
    const newUser = new User({ name, email, subject, message });
    await newUser.save();

    // Send email notification
await transporter.sendMail({
  from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER, // you receive it
  subject: `📩 New Message from ${name}: ${subject}`,
  text: `
You got a new message from your Portfolio!

Name: ${name}
Email: ${email}
Subject: ${subject}
Message: ${message}
  `,
  html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background: #f9f9f9;">
    <h2 style="color: #333; text-align: center;">📩 New Portfolio Message</h2>
    <p style="font-size: 15px; color: #555;">You have received a new message from your portfolio contact form:</p>
    
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
      <tr>
        <td style="padding: 10px; font-weight: bold; background: #eee; width: 30%;">Name:</td>
        <td style="padding: 10px; background: #fff;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold; background: #eee;">Email:</td>
        <td style="padding: 10px; background: #fff;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold; background: #eee;">Subject:</td>
        <td style="padding: 10px; background: #fff;">${subject}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold; background: #eee; vertical-align: top;">Message:</td>
        <td style="padding: 10px; background: #fff;">${message.replace(/\n/g, "<br>")}</td>
      </tr>
    </table>

    <p style="margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
      ✨ This email was sent from your <b>Portfolio Contact Form</b>.
    </p>
  </div>
  `,
});


    res.json({ success: true, msg: "✅ Message saved and email sent" });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ success: false, msg: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
