import { Router } from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../controller/projectController';
import { protect } from '../middleware/authMiddleware';
import upload from '../config/multerConfig';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Projects
 *     description: The project management API
 */

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: A list of projects
 */
router.get('/', getProjects);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - imageUrl
 *             properties:
 *               title:
 *                 type: string
 *                 description: The project title
 *               description:
 *                 type: string
 *                 description: The project description
 *               tags:
 *                 type: string
 *                 description: Comma-separated list of tags (e.g., "react,node,express")
 *               githubLink:
 *                 type: string
 *                 description: Link to the GitHub repository
 *               liveDemoLink:
 *                 type: string
 *                 description: Link to the live demo
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *                 description: Project image file
 *     responses:
 *       201:
 *         description: Project created successfully
 *       401:
 *         description: Not authorized
 */
router.post('/', protect, upload.single('imageUrl'), createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update an existing project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: string
 *               githubLink:
 *                 type: string
 *               liveDemoLink:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Project not found
 */
router.put('/:id', protect, upload.single('imageUrl'), updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Project removed
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Project not found
 */
router.delete('/:id', protect, deleteProject);

export default router;
