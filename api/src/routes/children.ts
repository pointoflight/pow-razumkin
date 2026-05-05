import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

export const childrenRouter = Router();

const childSchema = z.object({
  name: z.string().min(2, 'Укажите имя'),
  birthDate: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  interests: z.array(z.string()).optional(),
});

childrenRouter.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  const children = await prisma.child.findMany({
    where: { parentId: req.user!.userId },
    orderBy: { createdAt: 'asc' },
  });
  res.json({ success: true, data: children });
});

childrenRouter.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  const parsed = childSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.errors[0].message });
    return;
  }

  const { birthDate, ...rest } = parsed.data;
  const child = await prisma.child.create({
    data: {
      ...rest,
      parentId: req.user!.userId,
      ...(birthDate ? { birthDate: new Date(birthDate) } : {}),
    },
  });
  res.status(201).json({ success: true, data: child });
});

childrenRouter.put('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  const child = await prisma.child.findUnique({ where: { id: req.params.id } });
  if (!child || child.parentId !== req.user!.userId) {
    res.status(404).json({ success: false, error: 'Ребёнок не найден' });
    return;
  }

  const parsed = childSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.errors[0].message });
    return;
  }

  const { birthDate, ...rest } = parsed.data;
  const updated = await prisma.child.update({
    where: { id: req.params.id },
    data: { ...rest, ...(birthDate ? { birthDate: new Date(birthDate) } : {}) },
  });
  res.json({ success: true, data: updated });
});

childrenRouter.delete('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  const child = await prisma.child.findUnique({ where: { id: req.params.id } });
  if (!child || child.parentId !== req.user!.userId) {
    res.status(404).json({ success: false, error: 'Ребёнок не найден' });
    return;
  }
  await prisma.child.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});
