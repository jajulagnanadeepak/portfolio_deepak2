import { Resend } from "resend";

import User from "../models/user.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contactReceiver = process.env.MAIL_TO;
    const resolvedSubject = subject?.trim() || "New Contact Message";

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, msg: "Name, email and message are required" });
    }

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ success: false, msg: "Email service is not configured" });
    }

    if (!contactReceiver) {
      return res.status(500).json({ success: false, msg: "MAIL_TO is not configured" });
    }

    await new User({
      name: name.trim(),
      email: email.trim(),
      subject: resolvedSubject,
      message: message.trim(),
    }).save();

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
        <h2 style="margin-bottom: 8px;">New Contact Message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
        <p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
        <p><strong>Subject:</strong> ${escapeHtml(resolvedSubject)}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f3f4f6; border-radius: 8px; padding: 12px; white-space: pre-wrap;">${escapeHtml(message.trim())}</div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: contactReceiver,
      subject: resolvedSubject,
      html,
    });

    if (error) {
      console.error("Resend send error:", error);
      return res.status(500).json({ success: false, msg: "Message failed" });
    }

    return res.status(200).json({ success: true, msg: "Message sent" });
  } catch (err) {
    console.error("Contact message error:", err);
    return res.status(500).json({ success: false, msg: "Message failed" });
  }
};
