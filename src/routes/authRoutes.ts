import { Router } from 'express';
// Import our new controller functions
import { registerUser, loginUser } from '../controller/authController';

const router = Router();

// Instead of defining the logic here, we just point to the controller
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
