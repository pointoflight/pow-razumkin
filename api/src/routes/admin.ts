import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';

export const adminRouter = Router();

adminRouter.use(authenticate, requireRole('admin'));

adminRouter.get('/stats', async (_req: Request, res: Response): Promise<void> => {
  const [users, organizations, leads, pendingOrgs] = await Promise.all([
    prisma.user.count(),
    prisma.organization.count({ where: { isActive: true } }),
    prisma.lead.count(),
    prisma.organization.count({ where: { isVerified: false, isActive: true } }),
  ]);
  res.json({ success: true, data: { users, organizations, leads, pendingOrgs } });
});

adminRouter.get('/organizations/pending', async (_req: Request, res: Response): Promise<void> => {
  const orgs = await prisma.organization.findMany({
    where: { isVerified: false, isActive: true },
    include: { owner: { select: { name: true, email: true, phone: true } }, _count: { select: { services: true } } },
    orderBy: { createdAt: 'asc' },
  });
  res.json({ success: true, data: orgs });
});

adminRouter.patch('/organizations/:id/verify', async (req: Request, res: Response): Promise<void> => {
  const { verified } = req.body as { verified: boolean };
  const org = await prisma.organization.update({
    where: { id: req.params.id },
    data: { isVerified: verified },
  });
  res.json({ success: true, data: org });
});

adminRouter.get('/users', async (req: Request, res: Response): Promise<void> => {
  const { page = '1' } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * 20;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true, phone: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip,
    }),
    prisma.user.count(),
  ]);
  res.json({ success: true, data: users, pagination: { page: parseInt(page), total, totalPages: Math.ceil(total / 20) } });
});

adminRouter.get('/reviews/pending', async (_req: Request, res: Response): Promise<void> => {
  const reviews = await prisma.review.findMany({
    where: { isModerated: false },
    include: {
      author: { select: { name: true, email: true } },
      organization: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: reviews });
});

adminRouter.patch('/reviews/:id/moderate', async (req: Request, res: Response): Promise<void> => {
  const { approved } = req.body as { approved: boolean };
  if (approved) {
    await prisma.review.update({ where: { id: req.params.id }, data: { isModerated: true } });
  } else {
    await prisma.review.delete({ where: { id: req.params.id } });
  }
  res.json({ success: true });
});
