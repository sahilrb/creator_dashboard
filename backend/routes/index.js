import { Router } from 'express';
import userRoutes from './user.js';
// Import other route files as needed
import authRoutes from './auth.js';

const router = Router();

// Use individual route files
router.use('/users', userRoutes); // Routes for user-related operations
router.use('/auth', authRoutes); // Routes for authentication

export default router;