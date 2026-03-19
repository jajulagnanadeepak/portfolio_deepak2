import Project from '../models/Project.js';

export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .sort({ displayOrder: 1, createdAt: -1 });

        res.json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

export const createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);

        res.status(201).json({
            success: true,
            data: project
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: err.message
        });
    }
};

export const deleteProject = async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            msg: "Deleted"
        });
    } catch (err) {
        res.status(500).json({ success: false });
    }
};