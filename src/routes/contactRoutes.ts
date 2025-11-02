import { Router } from 'express';
import { submitContactForm } from '../controller/contactController';

const router = Router();

// === Define Routes ===

// @route  POST /api/contact
// Public: Anyone can send a message.
router.post('/', submitContactForm);

export default router;