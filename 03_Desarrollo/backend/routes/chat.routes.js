import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { consultarRAG } from '../controllers/chat.controller.js';

const router = Router();

router.use(authMiddleware);
router.post('/query', consultarRAG);

export default router;
