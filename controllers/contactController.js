import { Resend } from "resend";
import User from "../models/user.js";

export const sendMessage = async (req, res) => {
  try {
    console.log("🔥 NEW CONTROLLER RUNNING");

    const resend = new Resend(process.env.RESEND_API_KEY); // ✅ moved here

    const { name, email, subject, message } = req.body;
    const contactReceiver = process.env.MAIL_TO;

    const resolvedSubject = subject?.trim() || "New Contact Message";

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        msg: "Name, email and message are required"
      });
    }

    if (!contactReceiver) {
      return res.status(500).json({
        success: false,
        msg: "MAIL_TO is not configured"
      });
    }

    await new User({
      name: name.trim(),
      email: email.trim(),
      subject: resolvedSubject,
      message: message.trim(),
    }).save();

    const html = `
      <h2>New Message</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Message:</b> ${message}</p>
    `;

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: contactReceiver,
      subject: resolvedSubject,
      html,
    });

    console.log("Email sent:", response);

    return res.status(200).json({
      success: true,
      msg: "Message sent successfully"
    });

  } catch (err) {
    console.error("Error:", err);

    return res.status(500).json({
      success: false,
      msg: "Message failed"
    });
  }
};