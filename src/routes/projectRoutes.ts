import { Router } from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../controller/projectController';
import { protect } from '../middleware/authMiddleware';
import upload from '../config/multerConfig'; // <-- 1. IMPORT UPLOAD

const router = Router();

// === Define Routes ===

// GET /api/projects (No change)
router.get('/', getProjects);

// POST /api/projects
// We add 'upload.single("imageUrl")'
// This tells Multer to expect one file from a form field named 'imageUrl'.
router.post('/', protect, upload.single('imageUrl'), createProject); // <-- 2. ADD MIDDLEWARE

// PUT /api/projects/:id
// We add 'upload.single("imageUrl")' here too.
router.put('/:id', protect, upload.single('imageUrl'), updateProject); // <-- 3. ADD MIDDLEWARE

// DELETE /api/projects/:id (No change)
router.delete('/:id', protect, deleteProject);

export default router;