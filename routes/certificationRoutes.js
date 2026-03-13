import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
    createCertification,
    getCertifications,
    deleteCertification,
} from "../controllers/certificationController.js";

const router = express.Router();

// ✅ PUBLIC
router.get("/", getCertifications);

// 🔒 PROTECTED (ADMIN ONLY)
router.post("/", authMiddleware, createCertification);
router.delete("/:id", authMiddleware, deleteCertification);

export default router;