import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

export const servicesRouter = Router();

const serviceSchema = z.object({
  nameRu: z.string().min(2, 'Укажите название'),
  nameEn: z.string().optional(),
  descriptionRu: z.string().optional(),
  descriptionEn: z.string().optional(),
  priceFrom: z.number().min(0).optional(),
  priceTo: z.number().min(0).optional(),
  ageFrom: z.number().int().min(0).optional(),
  ageTo: z.number().int().min(0).optional(),
  scheduleInfo: z.string().optional(),
  organizationId: z.string(),
});

servicesRouter.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  const parsed = serviceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.errors[0].message });
    return;
  }

  const org = await prisma.organization.findUnique({ where: { id: parsed.data.organizationId } });
  if (!org || (org.ownerId !== req.user!.userId && req.user!.role !== 'admin')) {
    res.status(403).json({ success: false, error: 'Нет доступа' });
    return;
  }

  const service = await prisma.service.create({ data: parsed.data });
  res.status(201).json({ success: true, data: service });
});

servicesRouter.put('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  const service = await prisma.service.findUnique({
    where: { id: req.params.id },
    include: { organization: { select: { ownerId: true } } },
  });
  if (!service) {
    res.status(404).json({ success: false, error: 'Услуга не найдена' });
    return;
  }
  if (service.organization.ownerId !== req.user!.userId && req.user!.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Нет доступа' });
    return;
  }

  const parsed = serviceSchema.partial().omit({ organizationId: true }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.errors[0].message });
    return;
  }

  const updated = await prisma.service.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ success: true, data: updated });
});

servicesRouter.delete('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  const service = await prisma.service.findUnique({
    where: { id: req.params.id },
    include: { organization: { select: { ownerId: true } } },
  });
  if (!service || (service.organization.ownerId !== req.user!.userId && req.user!.role !== 'admin')) {
    res.status(403).json({ success: false, error: 'Нет доступа' });
    return;
  }
  await prisma.service.update({ where: { id: req.params.id }, data: { isActive: false } });
  res.json({ success: true });
});

servicesRouter.get('/organization/:orgId', async (req: Request, res: Response): Promise<void> => {
  const services = await prisma.service.findMany({
    where: { organizationId: req.params.orgId, isActive: true },
    orderBy: { createdAt: 'asc' },
  });
  res.json({ success: true, data: services });
});
