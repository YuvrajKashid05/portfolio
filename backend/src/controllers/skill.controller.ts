import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

export const getSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    const grouped = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
      acc[skill.category] = acc[skill.category] || [];
      acc[skill.category].push(skill);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      total: skills.length,
      skills,
      grouped,
    });
  } catch (error) {
    next(error);
  }
};

export const createSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, category, icon, proficiency, sortOrder = 0 } = req.body;

    const existing = await prisma.skill.findUnique({
      where: { name },
    });

    if (existing) {
      res.status(409).json({
        error: {
          code: 'SKILL_EXISTS',
          message: 'Skill with name ' + name + ' already exists',
        },
      });
      return;
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        icon,
        proficiency,
        sortOrder,
      },
    });

    res.status(201).json({ success: true, skill });
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const { name, category, icon, proficiency, sortOrder } = req.body;

    const existing = await prisma.skill.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({
        error: {
          code: 'SKILL_NOT_FOUND',
          message: 'Skill not found',
        },
      });
      return;
    }

    if (name && name !== existing.name) {
      const nameCheck = await prisma.skill.findUnique({ where: { name } });
      if (nameCheck) {
        res.status(409).json({
          error: {
            code: 'SKILL_EXISTS',
            message: 'Skill with name ' + name + ' already exists',
          },
        });
        return;
      }
    }

    const updated = await prisma.skill.update({
      where: { id },
      data: {
        name,
        category,
        icon,
        proficiency,
        sortOrder,
      },
    });

    res.status(200).json({ success: true, skill: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;

    const existing = await prisma.skill.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({
        error: {
          code: 'SKILL_NOT_FOUND',
          message: 'Skill not found',
        },
      });
      return;
    }

    await prisma.skill.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully',
      deletedId: id,
    });
  } catch (error) {
    next(error);
  }
};
