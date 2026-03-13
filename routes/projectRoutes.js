import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
    createProject,
    getProjects,
    deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

// public
router.get("/", getProjects);

// 🔒 protected
router.post("/", authMiddleware, createProject);
router.delete("/:id", authMiddleware, deleteProject);

export default router;