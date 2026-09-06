import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    title: z.string().min(2).max(120).optional(),
    bio: z.string().min(10).optional(),
    avatarUrl: z.string().url().optional().nullable(),
    resumeUrl: z.string().url().optional().nullable(),
    githubUrl: z.string().url().optional().nullable(),
    linkedinUrl: z.string().url().optional().nullable(),
    twitterUrl: z.string().url().optional().nullable(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, 'New password must be at least 6 characters').optional(),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
