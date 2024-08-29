import { Router } from "express";
import contactRoutes from './contacts.js';
import userRoutes from './auth.js';
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.use('/auth',  userRoutes);
router.use('/contacts', authenticate, contactRoutes);

export default router;