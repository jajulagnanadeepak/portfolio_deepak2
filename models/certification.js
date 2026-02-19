// models/certification.js (The updated version)

import mongoose from 'mongoose';

const CertificationSchema = new mongoose.Schema({
    name: { // Title of the Certification
        type: String,
        required: [true, 'Certification name is required.'],
        trim: true,
        unique: true
    },
    issuer: { // Issuing Organization
        type: String,
        required: [true, 'The issuing organization is required.']
    },
    url: { // Credential URL or Certificate Link
        type: String,
        required: [true, 'The credential URL is required.'],
        trim: true
    }
    // issueDate and imageUrl removed here
    
}, { 
    timestamps: true 
    // This setting { timestamps: true } will ADD 'createdAt' and 'updatedAt'.
    // If you don't want them, change this to { timestamps: false }.
});

export default mongoose.model('Certification', CertificationSchema);