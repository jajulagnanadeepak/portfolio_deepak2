// routes/certificationRoutes.js
import express from 'express';
import { 
    getCertifications, 
    addCertification, 
    updateCertification, 
    deleteCertification 
} from '../controllers/certificationController.js'; // <--- Check this file too

// NOTE: Implement and import your admin authentication middleware here later!
// import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Route: /api/v1/certifications
router.route('/')
    .get(getCertifications)         
    .post(/* protect, */ addCertification);  

// Route: /api/v1/certifications/:id
router.route('/:id')
    .put(/* protect, */ updateCertification)  
    .delete(/* protect, */ deleteCertification); 

export default router;