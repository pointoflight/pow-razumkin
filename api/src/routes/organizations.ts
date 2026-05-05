import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';
import { OrganizationType } from '@prisma/client';

export const organizationsRouter = Router();

const orgSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  type: z.nativeEnum(OrganizationType),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
});

function avgRating(reviews: { rating: number }[]): number | null {
  if (!reviews.length) return null;
  return Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
}

// Public: list / search
organizationsRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  const { q, type, city, page = '1', limit = '12' } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {
    isActive: true,
    ...(q ? {
      OR: [
        { name: { contains: q, mode: 'insensitive' as const } },
        { description: { contains: q, mode: 'insensitive' as const } },
      ],
    } : {}),
    ...(type ? { type: type as OrganizationType } : {}),
    ...(city ? { city: { contains: city, mode: 'insensitive' as const } } : {}),
  };

  const [organizations, total] = await Promise.all([
    prisma.organization.findMany({
      where,
      include: {
        reviews: { select: { rating: true }, where: { isModerated: true } },
        services: { select: { priceFrom: true, priceTo: true }, where: { isActive: true }, take: 1 },
        _count: { select: { services: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip,
    }),
    prisma.organization.count({ where }),
  ]);

  const data = organizations.map((org) => ({
    ...org,
    avgRating: avgRating(org.reviews),
    reviewCount: org.reviews.length,
    reviews: undefined,
  }));

  res.json({ success: true, data, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
});

// Public: get one
organizationsRouter.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const org = await prisma.organization.findFirst({
    where: { id: req.params.id, isActive: true },
    include: {
      services: { where: { isActive: true }, orderBy: { createdAt: 'asc' } },
      reviews: {
        where: { isModerated: true },
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      owner: { select: { name: true, phone: true } },
    },
  });

  if (!org) {
    res.status(404).json({ success: false, error: 'Организация не найдена' });
    return;
  }

  res.json({ success: true, data: { ...org, avgRating: avgRating(org.reviews), reviewCount: org.reviews.length } });
});

// Auth: create organization
organizationsRouter.post('/', authenticate, requireRole('business_owner', 'admin'), async (req: Request, res: Response): Promise<void> => {
  const parsed = orgSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.errors[0].message });
    return;
  }

  const org = await prisma.organization.create({
    data: { ...parsed.data, ownerId: req.user!.userId },
  });

  res.status(201).json({ success: true, data: org });
});

// Auth: update own organization
organizationsRouter.put('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  const org = await prisma.organization.findUnique({ where: { id: req.params.id } });
  if (!org) {
    res.status(404).json({ success: false, error: 'Организация не найдена' });
    return;
  }
  if (org.ownerId !== req.user!.userId && req.user!.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Нет доступа' });
    return;
  }

  const parsed = orgSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.errors[0].message });
    return;
  }

  const updated = await prisma.organization.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ success: true, data: updated });
});

// Auth: list my organizations
organizationsRouter.get('/my/list', authenticate, async (req: Request, res: Response): Promise<void> => {
  const orgs = await prisma.organization.findMany({
    where: { ownerId: req.user!.userId },
    include: { _count: { select: { leads: true, services: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: orgs });
});
