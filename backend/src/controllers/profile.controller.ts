import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db';

export const getPublicProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        name: true,
        title: true,
        bio: true,
        avatarUrl: true,
        resumeUrl: true,
        githubUrl: true,
        linkedinUrl: true,
        twitterUrl: true,
      },
    });

    if (!profile) {
      res.status(404).json({
        error: {
          code: 'PROFILE_NOT_FOUND',
          message: 'Public portfolio profile has not been initialized yet',
        },
      });
      return;
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const {
      name,
      title,
      bio,
      avatarUrl,
      resumeUrl,
      githubUrl,
      linkedinUrl,
      twitterUrl,
      currentPassword,
      newPassword,
    } = req.body;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      res.status(404).json({
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
      return;
    }

    let updatedPasswordHash: string | undefined;

    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({
          error: {
            code: 'CURRENT_PASSWORD_REQUIRED',
            message: 'Current password is required to set a new password',
          },
        });
        return;
      }

      const isMatch = await bcrypt.compare(currentPassword, currentUser.passwordHash);
      if (!isMatch) {
        res.status(400).json({
          error: {
            code: 'INVALID_CURRENT_PASSWORD',
            message: 'Incorrect current password provided',
          },
        });
        return;
      }

      updatedPasswordHash = await bcrypt.hash(newPassword, 12);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        title,
        bio,
        avatarUrl,
        resumeUrl,
        githubUrl,
        linkedinUrl,
        twitterUrl,
        ...(updatedPasswordHash ? { passwordHash: updatedPasswordHash } : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        title: true,
        bio: true,
        avatarUrl: true,
        resumeUrl: true,
        githubUrl: true,
        linkedinUrl: true,
        twitterUrl: true,
        role: true,
        updatedAt: true,
      },
    });

    res.status(200).json({ success: true, profile: updated });
  } catch (error) {
    next(error);
  }
};
