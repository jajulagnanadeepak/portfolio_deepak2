// routes/projectRoutes.js
import express from 'express';
import { 
    getProjects, 
    addProject,         // <--- Must match export name in controller
    updateProject, 
    deleteProject 
} from '../controllers/projectController.js';

// NOTE: Implement and import your admin authentication middleware here later!
// import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Route: /api/v1/projects
router.route('/')
    .get(getProjects)         
    .post(/* protect, */ addProject);  

// Route: /api/v1/projects/:id
router.route('/:id')
    .put(/* protect, */ updateProject)  
    .delete(/* protect, */ deleteProject); 

export default router;