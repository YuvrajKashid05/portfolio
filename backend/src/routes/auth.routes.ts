import { Router } from 'express';
import { login, getMe } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { loginSchema } from '../schemas/auth.schema';
import { requireAuth } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', authRateLimiter, validate(loginSchema), login);
router.get('/me', requireAuth, getMe);

export default router;
