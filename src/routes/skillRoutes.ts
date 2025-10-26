import { Router } from 'express';
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controller/skillController'; // 1. Import controller
import { protect } from '../middleware/authMiddleware'; // 2. Import 'protect'

const router = Router();

// === Define Routes ===

// @route  GET /api/skills
// Public: Anyone can see your skills.
router.get('/', getSkills);

// @route  POST /api/skills
// Private: Only you can add a new skill.
router.post('/', protect, createSkill);

// @route  PUT /api/skills/:id
// Private: Only you can update a skill.
router.put('/:id', protect, updateSkill);

// @route  DELETE /api/skills/:id
// Private: Only you can delete a skill.
router.delete('/:id', protect, deleteSkill);

export default router;