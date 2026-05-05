import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import { LeadStatus } from '@prisma/client';

export const leadsRouter = Router();

const createLeadSchema = z.object({
  organizationId: z.string().optional(),
  educatorId: z.string().optional(),
  childId: z.string().optional(),
  serviceId: z.string().optional(),
  message: z.string().optional(),
  parentName: z.string().min(2, 'Укажите имя'),
  parentPhone: z.string().min(10, 'Укажите телефон'),
});

// Public: create lead (no auth required — guest parents can enquire)
leadsRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  const parsed = createLeadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.errors[0].message });
    return;
  }

  if (!parsed.data.organizationId && !parsed.data.educatorId) {
    res.status(400).json({ success: false, error: 'Укажите организацию или педагога' });
    return;
  }

  // Use authenticated user id if available, otherwise require parentName/phone
  const token = req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');
  let parentId: string | null = null;
  if (token) {
    const { verifyAccessToken } = await import('../lib/jwt');
    const payload = verifyAccessToken(token);
    if (payload) parentId = payload.userId;
  }

  // If no auth, create or find an anonymous user placeholder
  if (!parentId) {
    let anon = await prisma.user.findFirst({ where: { email: `anon_${parsed.data.parentPhone.replace(/\D/g, '')}@razumkin.internal` } });
    if (!anon) {
      anon = await prisma.user.create({
        data: {
          email: `anon_${parsed.data.parentPhone.replace(/\D/g, '')}@razumkin.internal`,
          passwordHash: '',
          name: parsed.data.parentName,
          phone: parsed.data.parentPhone,
          role: 'parent',
        },
      });
    }
    parentId = anon.id;
  }

  const lead = await prisma.lead.create({
    data: {
      parentId,
      organizationId: parsed.data.organizationId,
      educatorId: parsed.data.educatorId,
      childId: parsed.data.childId,
      serviceId: parsed.data.serviceId,
      message: parsed.data.message,
      parentName: parsed.data.parentName,
      parentPhone: parsed.data.parentPhone,
    },
  });

  res.status(201).json({ success: true, data: lead });
});

// Auth: get leads for my organization(s)
leadsRouter.get('/incoming', authenticate, async (req: Request, res: Response): Promise<void> => {
  const { status, orgId, page = '1' } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * 20;

  const myOrgs = await prisma.organization.findMany({
    where: { ownerId: req.user!.userId },
    select: { id: true },
  });
  const orgIds = myOrgs.map((o) => o.id);

  if (orgId && !orgIds.includes(orgId)) {
    res.status(403).json({ success: false, error: 'Нет доступа' });
    return;
  }

  const where = {
    organizationId: { in: orgId ? [orgId] : orgIds },
    ...(status ? { status: status as LeadStatus } : {}),
  };

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: {
        organization: { select: { id: true, name: true } },
        service: { select: { nameRu: true } },
        child: { select: { name: true, birthDate: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip,
    }),
    prisma.lead.count({ where }),
  ]);

  res.json({ success: true, data: leads, pagination: { page: parseInt(page), total, totalPages: Math.ceil(total / 20) } });
});

// Auth: get my sent requests (parent)
leadsRouter.get('/my', authenticate, async (req: Request, res: Response): Promise<void> => {
  const leads = await prisma.lead.findMany({
    where: { parentId: req.user!.userId },
    include: {
      organization: { select: { id: true, name: true, type: true, logoUrl: true } },
      service: { select: { nameRu: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: leads });
});

// Auth: update lead status (business owner)
leadsRouter.patch('/:id/status', authenticate, async (req: Request, res: Response): Promise<void> => {
  const { status, notes } = req.body as { status: LeadStatus; notes?: string };

  const lead = await prisma.lead.findUnique({
    where: { id: req.params.id },
    include: { organization: { select: { ownerId: true } } },
  });

  if (!lead) {
    res.status(404).json({ success: false, error: 'Заявка не найдена' });
    return;
  }

  // Check ownership: org owner, educator (via profile), or admin
  let isOwner = lead.organization?.ownerId === req.user!.userId || req.user!.role === 'admin';
  if (!isOwner && lead.educatorId) {
    const ep = await prisma.educatorProfile.findUnique({ where: { userId: req.user!.userId }, select: { id: true } });
    isOwner = ep?.id === lead.educatorId;
  }

  if (!isOwner) {
    res.status(403).json({ success: false, error: 'Нет доступа' });
    return;
  }

  const updated = await prisma.lead.update({
    where: { id: req.params.id },
    data: { status, ...(notes !== undefined ? { notes } : {}) },
  });

  res.json({ success: true, data: updated });
});
