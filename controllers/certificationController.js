// controllers/certificationController.js

import Certification from '../models/certification.js';

// @desc    Get all Certifications (PUBLIC)
// @route   GET /api/v1/certifications
export const getCertifications = async (req, res) => {
    try {
        const certifications = await Certification.find().sort({ issueDate: -1 });
        res.status(200).json({ success: true, count: certifications.length, data: certifications });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add a new Certification (ADMIN ONLY)
// @route   POST /api/v1/certifications
export const addCertification = async (req, res) => {
    try {
        const certification = await Certification.create(req.body);
        res.status(201).json({ success: true, data: certification });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        }
        res.status(500).json({ success: false, error: `Could not create certification. ${error.message}` });
    }
};

// @desc    Update a Certification by ID (ADMIN ONLY)
// @route   PUT /api/v1/certifications/:id
export const updateCertification = async (req, res) => {
    try {
        const certification = await Certification.findByIdAndUpdate(req.params.id, req.body, {
            new: true, 
            runValidators: true 
        });

        if (!certification) {
            return res.status(404).json({ success: false, error: 'Certification not found' });
        }
        res.status(200).json({ success: true, data: certification });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete a Certification by ID (ADMIN ONLY)
// @route   DELETE /api/v1/certifications/:id
export const deleteCertification = async (req, res) => {
    try {
        const certification = await Certification.findByIdAndDelete(req.params.id);

        if (!certification) {
            return res.status(404).json({ success: false, error: 'Certification not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};