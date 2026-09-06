import { Router } from 'express';
import {
  submitContact,
  getContacts,
  updateContactStatus,
  deleteContact,
} from '../controllers/contact.controller';
import { requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { contactRateLimiter } from '../middleware/rateLimiter';
import {
  submitContactSchema,
  updateContactStatusSchema,
  contactIdParamSchema,
  contactQuerySchema,
} from '../schemas/contact.schema';

const router = Router();

// Public submission with IP rate limiting & honeypot validation
router.post('/', contactRateLimiter, validate(submitContactSchema), submitContact);

// Admin-protected inbox management
router.get('/', requireAdmin, validate(contactQuerySchema), getContacts);
router.patch('/:id/status', requireAdmin, validate(updateContactStatusSchema), updateContactStatus);
router.delete('/:id', requireAdmin, validate(contactIdParamSchema), deleteContact);

export default router;
