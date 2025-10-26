import { Router } from 'express';
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controller/experienceController'; // 1. Import controller
import { protect } from '../middleware/authMiddleware'; // 2. Import 'protect'

const router = Router();

// === Define Routes ===

// @route  GET /api/experience
// Public: Anyone can see your work experience.
router.get('/', getExperiences);

// @route  POST /api/experience
// Private: Only you can add a new experience.
router.post('/', protect, createExperience);

// @route  PUT /api/experience/:id
// Private: Only you can update an experience.
router.put('/:id', protect, updateExperience);

// @route  DELETE /api/experience/:id
// Private: Only you can delete an experience.
router.delete('/:id', protect, deleteExperience);

export default router;