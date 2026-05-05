import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt';
import { authenticate } from '../middleware/auth';
import { UserRole } from '@prisma/client';

export const authRouter = Router();

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: false,
};

const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().optional(),
  role: z.enum(['parent', 'business_owner', 'educator']).default('parent'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

authRouter.post('/register', async (req: Request, res: Response): Promise<void> => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.errors[0].message });
    return;
  }

  const { email, password, name, phone, role } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    res.status(409).json({ success: false, error: 'Пользователь с таким email уже существует' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash, name, phone, role: role as UserRole },
    select: { id: true, email: true, name: true, role: true, phone: true },
  });

  const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role, name: user.name });
  const refreshToken = signRefreshToken({ userId: user.id });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  res
    .cookie('auth_token', accessToken, { ...COOKIE_OPTS, maxAge: 24 * 60 * 60 * 1000 })
    .cookie('refresh_token', refreshToken, { ...COOKIE_OPTS, maxAge: 30 * 24 * 60 * 60 * 1000 })
    .json({ success: true, data: user });
});

authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: 'Некорректные данные' });
    return;
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ success: false, error: 'Неверный email или пароль' });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ success: false, error: 'Неверный email или пароль' });
    return;
  }

  const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role, name: user.name });
  const refreshToken = signRefreshToken({ userId: user.id });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  res
    .cookie('auth_token', accessToken, { ...COOKIE_OPTS, maxAge: 24 * 60 * 60 * 1000 })
    .cookie('refresh_token', refreshToken, { ...COOKIE_OPTS, maxAge: 30 * 24 * 60 * 60 * 1000 })
    .json({
      success: true,
      data: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
    });
});

authRouter.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.refresh_token;
  if (!token) {
    res.status(401).json({ success: false, error: 'Требуется refresh token' });
    return;
  }

  const payload = verifyRefreshToken(token);
  if (!payload) {
    res.status(401).json({ success: false, error: 'Недействительный refresh token' });
    return;
  }

  const storedToken = await prisma.refreshToken.findUnique({ where: { token } });
  if (!storedToken || storedToken.expiresAt < new Date()) {
    res.status(401).json({ success: false, error: 'Refresh token истёк' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    res.status(401).json({ success: false, error: 'Пользователь не найден' });
    return;
  }

  await prisma.refreshToken.delete({ where: { token } });

  const newAccessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role, name: user.name });
  const newRefreshToken = signRefreshToken({ userId: user.id });

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  res
    .cookie('auth_token', newAccessToken, { ...COOKIE_OPTS, maxAge: 24 * 60 * 60 * 1000 })
    .cookie('refresh_token', newRefreshToken, { ...COOKIE_OPTS, maxAge: 30 * 24 * 60 * 60 * 1000 })
    .json({ success: true });
});

authRouter.post('/logout', authenticate, async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.refresh_token;
  if (token) {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }
  res
    .clearCookie('auth_token')
    .clearCookie('refresh_token')
    .json({ success: true });
});

authRouter.get('/me', authenticate, async (req: Request, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, email: true, name: true, role: true, phone: true, createdAt: true },
  });
  res.json({ success: true, data: user });
});
