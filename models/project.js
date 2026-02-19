// models/Project.js

import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required.'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Project description is required.']
    },
    // Technologies is stored as an array of strings
    technologies: { 
        type: [String], 
        required: [true, 'Technology stack is required.']
    },
    liveUrl: {
        type: String,
        trim: true
    },
    githubUrl: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    },
    displayOrder: { 
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('Project', ProjectSchema);