import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    technologies: {
        type: [String],
        required: true
    },
    liveUrl: String,
    githubUrl: String,
    imageUrl: String,
    displayOrder: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('Project', ProjectSchema);