import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const getProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { featured, skill, search } = req.query as {
      featured?: string;
      skill?: string;
      search?: string;
    };

    const whereClause: any = {};

    if (featured === 'true') {
      whereClause.featured = true;
    } else if (featured === 'false') {
      whereClause.featured = false;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { tagline: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (skill) {
      whereClause.skills = {
        some: {
          skill: {
            OR: [
              { id: skill },
              { name: { equals: skill, mode: 'insensitive' } },
            ],
          },
        },
      };
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    const formatted = projects.map((p) => ({
      ...p,
      skills: p.skills.map((s) => s.skill),
    }));

    res.status(200).json({ success: true, count: formatted.length, projects: formatted });
  } catch (error) {
    next(error);
  }
};

export const getProjectByIdOrSlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const identifier = (Array.isArray(req.params.identifier) ? req.params.identifier[0] : req.params.identifier) as string;

    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!project) {
      res.status(404).json({
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project with identifier ' + identifier + ' was not found',
        },
      });
      return;
    }

    const formatted = {
      ...project,
      skills: project.skills.map((s) => s.skill),
    };

    res.status(200).json({ success: true, project: formatted });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const {
      title,
      slug: customSlug,
      tagline,
      description,
      thumbnailUrl,
      demoUrl,
      repoUrl,
      featured = false,
      sortOrder = 0,
      skillIds = [],
    } = req.body;

    const finalSlug = customSlug || slugify(title);

    const existing = await prisma.project.findUnique({
      where: { slug: finalSlug },
    });

    if (existing) {
      res.status(409).json({
        error: {
          code: 'SLUG_TAKEN',
          message: 'Slug ' + finalSlug + ' is already in use. Please provide a unique slug.',
        },
      });
      return;
    }

    const newProject = await prisma.project.create({
      data: {
        title,
        slug: finalSlug,
        tagline,
        description,
        thumbnailUrl,
        demoUrl,
        repoUrl,
        featured,
        sortOrder,
        userId,
        skills: {
          create: skillIds.map((id: string) => ({
            skill: { connect: { id } },
          })),
        },
      },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      project: {
        ...newProject,
        skills: newProject.skills.map((s) => s.skill),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const {
      title,
      slug,
      tagline,
      description,
      thumbnailUrl,
      demoUrl,
      repoUrl,
      featured,
      sortOrder,
      skillIds,
    } = req.body;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found',
        },
      });
      return;
    }

    if (slug && slug !== existing.slug) {
      const slugCheck = await prisma.project.findUnique({ where: { slug } });
      if (slugCheck) {
        res.status(409).json({
          error: {
            code: 'SLUG_TAKEN',
            message: 'Slug ' + slug + ' is already in use.',
          },
        });
        return;
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (skillIds && Array.isArray(skillIds)) {
        await tx.projectsOnSkills.deleteMany({
          where: { projectId: id },
        });

        if (skillIds.length > 0) {
          await tx.projectsOnSkills.createMany({
            data: skillIds.map((skillId: string) => ({
              projectId: id,
              skillId,
            })),
          });
        }
      }

      return tx.project.update({
        where: { id },
        data: {
          title,
          slug,
          tagline,
          description,
          thumbnailUrl,
          demoUrl,
          repoUrl,
          featured,
          sortOrder,
        },
        include: {
          skills: {
            include: {
              skill: true,
            },
          },
        },
      });
    });

    res.status(200).json({
      success: true,
      project: {
        ...updated,
        skills: updated.skills.map((s) => s.skill),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found',
        },
      });
      return;
    }

    await prisma.project.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Project successfully deleted',
      deletedId: id,
    });
  } catch (error) {
    next(error);
  }
};
