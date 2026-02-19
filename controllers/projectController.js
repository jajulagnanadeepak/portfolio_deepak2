// controllers/projectController.js

import Project from '../models/project.js';

// @desc    Get all Projects (PUBLIC)
// @route   GET /api/v1/projects
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ displayOrder: 1, createdAt: -1 });
        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add a new Project (ADMIN ONLY)
// @route   POST /api/v1/projects
export const addProject = async (req, res) => { // <--- This function MUST be exported
    try {
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, data: project });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        }
        res.status(500).json({ success: false, error: `Could not create project. ${error.message}` });
    }
};

// @desc    Update a Project by ID (ADMIN ONLY)
// @route   PUT /api/v1/projects/:id
export const updateProject = async (req, res) => { // <--- This function MUST be exported
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true, 
            runValidators: true 
        });

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete a Project by ID (ADMIN ONLY)
// @route   DELETE /api/v1/projects/:id
export const deleteProject = async (req, res) => { // <--- This function MUST be exported
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};