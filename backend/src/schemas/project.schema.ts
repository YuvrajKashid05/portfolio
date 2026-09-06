import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(100),
    slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric characters and hyphens').optional(),
    tagline: z.string().min(5, 'Tagline must be at least 5 characters').max(255),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    thumbnailUrl: z.string().url('Thumbnail URL must be a valid URL'),
    demoUrl: z.string().url('Demo URL must be a valid URL').optional().nullable(),
    repoUrl: z.string().url('Repo URL must be a valid URL').optional().nullable(),
    featured: z.boolean().default(false),
    sortOrder: z.number().int().default(0),
    skillIds: z.array(z.string().uuid('Each skill ID must be a valid UUID')).default([]),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().uuid('Project ID must be a valid UUID'),
  }),
  body: z.object({
    title: z.string().min(2).max(100).optional(),
    slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/).optional(),
    tagline: z.string().min(5).max(255).optional(),
    description: z.string().min(10).optional(),
    thumbnailUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional().nullable(),
    repoUrl: z.string().url().optional().nullable(),
    featured: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
    skillIds: z.array(z.string().uuid()).optional(),
  }),
});

export const getProjectByIdOrSlugSchema = z.object({
  params: z.object({
    identifier: z.string().min(1, 'Identifier is required'),
  }),
});

export const projectQuerySchema = z.object({
  query: z.object({
    featured: z.enum(['true', 'false']).optional(),
    skill: z.string().optional(),
    search: z.string().optional(),
  }).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>['body'];
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>['body'];
