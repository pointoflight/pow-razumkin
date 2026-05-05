import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

export const reviewsRouter = Router();

const reviewSchema = z.object({
  organizationId: z.string().optional(),
  educatorId: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  body: z.string().max(2000).optional(),
});

reviewsRouter.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.errors[0].message });
    return;
  }
  if (!parsed.data.organizationId && !parsed.data.educatorId) {
    res.status(400).json({ success: false, error: 'Укажите организацию или педагога' });
    return;
  }

  const existing = await prisma.review.findFirst({
    where: {
      authorId: req.user!.userId,
      organizationId: parsed.data.organizationId,
      educatorId: parsed.data.educatorId,
    },
  });
  if (existing) {
    res.status(409).json({ success: false, error: 'Вы уже оставляли отзыв' });
    return;
  }

  const review = await prisma.review.create({
    data: { ...parsed.data, authorId: req.user!.userId },
    include: { author: { select: { name: true } } },
  });
  res.status(201).json({ success: true, data: review });
});
