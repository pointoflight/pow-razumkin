import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

export const educatorsRouter = Router();

const profileSchema = z.object({
  bio: z.string().optional(),
  specializations: z.array(z.string()).optional(),
  experienceYears: z.number().int().min(0).optional(),
  city: z.string().optional(),
});

// Public: list
educatorsRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  const { q, city, page = '1', limit = '12' } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {
    isActive: true,
    ...(q ? {
      OR: [
        { bio: { contains: q, mode: 'insensitive' as const } },
        { user: { name: { contains: q, mode: 'insensitive' as const } } },
      ],
    } : {}),
    ...(city ? { city: { contains: city, mode: 'insensitive' as const } } : {}),
  };

  const [educators, total] = await Promise.all([
    prisma.educatorProfile.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        reviews: { select: { rating: true }, where: { isModerated: true } },
      },
      take: parseInt(limit),
      skip,
    }),
    prisma.educatorProfile.count({ where }),
  ]);

  const data = educators.map((e) => ({
    ...e,
    avgRating: e.reviews.length ? Math.round((e.reviews.reduce((s, r) => s + r.rating, 0) / e.reviews.length) * 10) / 10 : null,
    reviewCount: e.reviews.length,
    reviews: undefined,
  }));

  res.json({ success: true, data, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
});

// Public: get one
educatorsRouter.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const educator = await prisma.educatorProfile.findFirst({
    where: { id: req.params.id, isActive: true },
    include: {
      user: { select: { name: true, phone: true, email: true } },
      reviews: {
        where: { isModerated: true },
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!educator) {
    res.status(404).json({ success: false, error: 'Педагог не найден' });
    return;
  }

  const avgRating = educator.reviews.length
    ? Math.round((educator.reviews.reduce((s, r) => s + r.rating, 0) / educator.reviews.length) * 10) / 10
    : null;

  res.json({ success: true, data: { ...educator, avgRating, reviewCount: educator.reviews.length } });
});

// Auth: create or update own profile
educatorsRouter.put('/my/profile', authenticate, async (req: Request, res: Response): Promise<void> => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.errors[0].message });
    return;
  }

  const profile = await prisma.educatorProfile.upsert({
    where: { userId: req.user!.userId },
    update: parsed.data,
    create: { userId: req.user!.userId, ...parsed.data },
  });

  res.json({ success: true, data: profile });
});

// Auth: get my profile
educatorsRouter.get('/my/profile', authenticate, async (req: Request, res: Response): Promise<void> => {
  const profile = await prisma.educatorProfile.findUnique({
    where: { userId: req.user!.userId },
    include: {
      reviews: {
        where: { isModerated: true },
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  res.json({ success: true, data: profile });
});

// Auth: get leads sent to my educator profile
educatorsRouter.get('/my/leads', authenticate, async (req: Request, res: Response): Promise<void> => {
  const { status } = req.query as Record<string, string>;

  const profile = await prisma.educatorProfile.findUnique({
    where: { userId: req.user!.userId },
    select: { id: true },
  });

  if (!profile) {
    res.json({ success: true, data: [] });
    return;
  }

  const where = {
    educatorId: profile.id,
    ...(status ? { status: status as import('@prisma/client').LeadStatus } : {}),
  };

  const leads = await prisma.lead.findMany({
    where,
    include: {
      child: { select: { name: true, birthDate: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: leads });
});
