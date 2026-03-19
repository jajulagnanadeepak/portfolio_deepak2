import express from "express";
import {
    createProject,
    getProjects,
    deleteProject
} from "../controllers/projectController.js";

const router = express.Router();

// PUBLIC
router.get("/", getProjects);

export default router;