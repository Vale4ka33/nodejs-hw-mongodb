import { Router } from "express";
import contactRoutes from './contacts.js';
import userRoutes from './auth.js';

const router = Router();

router.use('/auth', userRoutes);
router.use('/contacts', contactRoutes);

export default router;