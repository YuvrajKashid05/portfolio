import { Router } from 'express';
import { getPublicProfile, updateProfile } from '../controllers/profile.controller';
import { requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateProfileSchema } from '../schemas/profile.schema';

const router = Router();

// Public read
router.get('/', getPublicProfile);

// Admin update
router.put('/', requireAdmin, validate(updateProfileSchema), updateProfile);

export default router;
