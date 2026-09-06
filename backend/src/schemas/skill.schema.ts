import { z } from 'zod';

export const skillCategoryEnum = z.enum([
  'FRONTEND',
  'BACKEND',
  'DATABASE',
  'MOBILE',
  'AI_ML',
  'DEVOPS',
  'TOOLS'
]);

export const createSkillSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Skill name is required').max(50),
    category: skillCategoryEnum,
    icon: z.string().optional().nullable(),
    proficiency: z.number().int().min(1).max(100).optional().nullable(),
    sortOrder: z.number().int().default(0),
  }),
});

export const updateSkillSchema = z.object({
  params: z.object({
    id: z.string().uuid('Skill ID must be a valid UUID'),
  }),
  body: z.object({
    name: z.string().min(1).max(50).optional(),
    category: skillCategoryEnum.optional(),
    icon: z.string().optional().nullable(),
    proficiency: z.number().int().min(1).max(100).optional().nullable(),
    sortOrder: z.number().int().optional(),
  }),
});

export const skillIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Skill ID must be a valid UUID'),
  }),
});

export type CreateSkillInput = z.infer<typeof createSkillSchema>['body'];
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>['body'];
