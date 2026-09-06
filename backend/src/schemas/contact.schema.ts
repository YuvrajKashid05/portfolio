import { z } from 'zod';

export const submitContactSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Please provide a valid email address'),
    subject: z.string().max(150).optional().nullable(),
    message: z.string().min(10, 'Message must be at least 10 characters').max(3000),
    // Honeypot field - bots fill this in, real users won't
    website: z.string().max(0, 'Spam detected').optional(),
  }),
});

export const contactIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Contact ID must be a valid UUID'),
  }),
});

export const updateContactStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Contact ID must be a valid UUID'),
  }),
  body: z.object({
    status: z.enum(['UNREAD', 'READ', 'ARCHIVED', 'SPAM']),
  }),
});

export const contactQuerySchema = z.object({
  query: z.object({
    status: z.enum(['UNREAD', 'READ', 'ARCHIVED', 'SPAM']).optional(),
  }).optional(),
});

export type SubmitContactInput = z.infer<typeof submitContactSchema>['body'];
export type UpdateContactStatusInput = z.infer<typeof updateContactStatusSchema>['body'];
