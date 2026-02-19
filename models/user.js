// models/user.js 
// (Stores contact form messages)

import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('User', MessageSchema);