import { Router } from 'express';
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skill.controller';
import { requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createSkillSchema,
  updateSkillSchema,
  skillIdParamSchema,
} from '../schemas/skill.schema';

const router = Router();

// Public read
router.get('/', getSkills);

// Admin-protected mutations
router.post('/', requireAdmin, validate(createSkillSchema), createSkill);
router.put('/:id', requireAdmin, validate(updateSkillSchema), updateSkill);
router.delete('/:id', requireAdmin, validate(skillIdParamSchema), deleteSkill);

export default router;
