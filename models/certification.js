import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        issuer: { type: String, required: true },
        year: { type: String, required: true },
        credentialUrl: { type: String, required: true },
        imageUrl: { type: String }, // optional
    },
    { timestamps: true }
);

export default mongoose.model("Certification", certificationSchema);