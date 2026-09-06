import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

export const submitContact = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, subject, message, website } = req.body;

    if (website && website.trim().length > 0) {
      console.warn('Spam bot contact submission detected and silently dropped from IP: ' + req.ip);
      res.status(200).json({
        success: true,
        message: 'Thank you for your message. We will get back to you shortly.',
      });
      return;
    }

    const rawIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || null;
    const rawAgent = req.headers['user-agent'];
    const userAgent = Array.isArray(rawAgent) ? rawAgent[0] : rawAgent || null;

    const contact = await prisma.contact.create({
      data: {
        name,
        email: email.toLowerCase(),
        subject: subject || null,
        message,
        ipAddress: typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : null,
        userAgent,
        status: 'UNREAD',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received.',
      id: contact.id,
    });
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.query as { status?: 'UNREAD' | 'READ' | 'ARCHIVED' | 'SPAM' };

    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    const contacts = await prisma.contact.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    const unreadCount = await prisma.contact.count({
      where: { status: 'UNREAD' },
    });

    res.status(200).json({
      success: true,
      unreadCount,
      total: contacts.length,
      contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const { status } = req.body;

    const existing = await prisma.contact.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({
        error: {
          code: 'CONTACT_NOT_FOUND',
          message: 'Contact record not found',
        },
      });
      return;
    }

    const updated = await prisma.contact.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({ success: true, contact: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;

    const existing = await prisma.contact.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({
        error: {
          code: 'CONTACT_NOT_FOUND',
          message: 'Contact record not found',
        },
      });
      return;
    }

    await prisma.contact.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Contact record deleted successfully',
      deletedId: id,
    });
  } catch (error) {
    next(error);
  }
};
