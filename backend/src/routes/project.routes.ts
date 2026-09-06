import { Router } from 'express';
import {
  getProjects,
  getProjectByIdOrSlug,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller';
import { requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createProjectSchema,
  updateProjectSchema,
  getProjectByIdOrSlugSchema,
  projectQuerySchema,
} from '../schemas/project.schema';

const router = Router();

// Public routes
router.get('/', validate(projectQuerySchema), getProjects);
router.get('/:identifier', validate(getProjectByIdOrSlugSchema), getProjectByIdOrSlug);

// Admin-protected routes
router.post('/', requireAdmin, validate(createProjectSchema), createProject);
router.put('/:id', requireAdmin, validate(updateProjectSchema), updateProject);
router.delete('/:id', requireAdmin, deleteProject);

export default router;
