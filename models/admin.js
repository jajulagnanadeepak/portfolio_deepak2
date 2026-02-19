import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    otp: { type: String },
    otpExpiresAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('Admin', AdminSchema);


