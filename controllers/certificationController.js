import Certification from "../models/certification.js";

export const getCertifications = async (req, res) => {
    try {
        const certifications = await Certification.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: certifications.length, data: certifications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Failed to fetch certifications" });
    }
};

export const createCertification = async (req, res) => {
    try {
        const {
            name,
            issuer,
            year,
            credentialUrl,
            url,        // from frontend
            imageUrl,   // optional
        } = req.body;

        // ✅ map frontend → backend
        const cert = await Certification.create({
            name,
            issuer,
            year,
            credentialUrl: credentialUrl || url,
            imageUrl: imageUrl || null,
        });

        res.status(201).json({ success: true, data: cert });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Failed to create certification" });
    }
};

export const deleteCertification = async (req, res) => {
    try {
        const cert = await Certification.findByIdAndDelete(req.params.id);

        if (!cert) {
            return res.status(404).json({ success: false, msg: "Certification not found" });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Failed to delete certification" });
    }
};