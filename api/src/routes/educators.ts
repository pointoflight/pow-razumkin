import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

interface DemoService { name: string; priceFrom: number; priceTo: number; duration: string; format: string }
interface DemoPost { title: string; body: string; type: 'article' | 'tip'; createdAt: string }

function getDemoServicesForEmail(email: string, specializations: string[]): DemoService[] {
  const spec = specializations.join(' ').toLowerCase();
  if (email === 'teacher@example.ru') return [
    { name: 'Индивидуальный урок (60 мин)', priceFrom: 2500, priceTo: 3000, duration: '60 мин', format: 'Онлайн / Очно' },
    { name: 'Подготовка к ОГЭ (курс, 24 занятия)', priceFrom: 28000, priceTo: 35000, duration: '3 месяца', format: 'Онлайн' },
    { name: 'Подготовка к ЕГЭ профиль (полный курс)', priceFrom: 45000, priceTo: 60000, duration: '6 месяцев', format: 'Онлайн' },
    { name: 'Экспресс-консультация (30 мин)', priceFrom: 1200, priceTo: 1500, duration: '30 мин', format: 'Онлайн' },
  ];
  if (email === 'garcia.sochi@example.ru') return [
    { name: 'Урок испанского — индивидуально (60 мин)', priceFrom: 2200, priceTo: 2800, duration: '60 мин', format: 'Онлайн / Очно' },
    { name: 'Разговорный испанский — курс (12 занятий)', priceFrom: 20000, priceTo: 25000, duration: '1,5 месяца', format: 'Очно' },
    { name: 'Подготовка к DELE (A2–B2)', priceFrom: 30000, priceTo: 40000, duration: '3 месяца', format: 'Онлайн / Очно' },
    { name: 'Пробный урок', priceFrom: 0, priceTo: 0, duration: '30 мин', format: 'Онлайн' },
  ];
  if (email === 'rinatova.kazan@example.ru') return [
    { name: 'Урок рисования / живописи (60 мин)', priceFrom: 1500, priceTo: 2000, duration: '60 мин', format: 'Очно' },
    { name: 'Курс акварели (8 занятий)', priceFrom: 9000, priceTo: 12000, duration: '1 месяц', format: 'Очно' },
    { name: 'Подготовка к поступлению в худ. школу', priceFrom: 18000, priceTo: 22000, duration: '2 месяца', format: 'Очно' },
    { name: 'Пробный урок', priceFrom: 0, priceTo: 0, duration: '30 мин', format: 'Очно' },
  ];
  // Generic services by specialization
  if (spec.includes('английск') || spec.includes('испанск') || spec.includes('язык')) return [
    { name: 'Индивидуальный урок иностранного языка (60 мин)', priceFrom: 1800, priceTo: 2500, duration: '60 мин', format: 'Онлайн / Очно' },
    { name: 'Курс разговорной практики (10 занятий)', priceFrom: 14000, priceTo: 20000, duration: '1,5 месяца', format: 'Онлайн' },
    { name: 'Подготовка к международному экзамену', priceFrom: 25000, priceTo: 35000, duration: '3 месяца', format: 'Онлайн' },
  ];
  if (spec.includes('фортепиано') || spec.includes('скрипк') || spec.includes('музык')) return [
    { name: 'Урок музыки (45 мин)', priceFrom: 1500, priceTo: 2000, duration: '45 мин', format: 'Очно' },
    { name: 'Курс обучения инструменту (10 занятий)', priceFrom: 12000, priceTo: 16000, duration: '1 месяц', format: 'Очно' },
    { name: 'Подготовка к поступлению в муз. школу', priceFrom: 8000, priceTo: 12000, duration: '2 месяца', format: 'Очно' },
  ];
  if (spec.includes('рисов') || spec.includes('живопись') || spec.includes('акварел')) return [
    { name: 'Урок рисования (60 мин)', priceFrom: 1500, priceTo: 2000, duration: '60 мин', format: 'Очно' },
    { name: 'Курс акварели или масла (8 занятий)', priceFrom: 9000, priceTo: 13000, duration: '1 месяц', format: 'Очно' },
    { name: 'Подготовка к поступлению в худ. школу', priceFrom: 16000, priceTo: 22000, duration: '2 месяца', format: 'Очно' },
  ];
  if (spec.includes('плаван') || spec.includes('теннис') || spec.includes('фитнес') || spec.includes('спорт')) return [
    { name: 'Персональная тренировка (60 мин)', priceFrom: 1800, priceTo: 2500, duration: '60 мин', format: 'Очно' },
    { name: 'Абонемент (8 тренировок)', priceFrom: 10000, priceTo: 14000, duration: '1 месяц', format: 'Очно' },
  ];
  if (spec.includes('програм') || spec.includes('python') || spec.includes('scratch')) return [
    { name: 'Урок программирования (60 мин)', priceFrom: 1800, priceTo: 2500, duration: '60 мин', format: 'Онлайн / Очно' },
    { name: 'Курс Python с нуля (12 занятий)', priceFrom: 15000, priceTo: 20000, duration: '1,5 месяца', format: 'Онлайн' },
    { name: 'Разработка первого проекта', priceFrom: 18000, priceTo: 25000, duration: '2 месяца', format: 'Онлайн' },
  ];
  return [
    { name: 'Индивидуальное занятие (60 мин)', priceFrom: 1800, priceTo: 2500, duration: '60 мин', format: 'Онлайн / Очно' },
    { name: 'Пробный урок (30 мин)', priceFrom: 0, priceTo: 0, duration: '30 мин', format: 'Онлайн' },
  ];
}

function getDemoPostsForEmail(email: string, specializations: string[]): DemoPost[] {
  const spec = specializations.join(' ').toLowerCase();
  const ago = (days: number) => new Date(Date.now() - days * 86400000).toISOString();
  if (email === 'teacher@example.ru') return [
    { title: 'Как помочь ребёнку полюбить математику', body: 'Многие дети боятся математики — и это не их вина. Главная ошибка взрослых: ругать за ошибки вместо того, чтобы объяснять. В этой статье я делюсь проверенными приёмами, которые превращают страх в интерес. Начинаем с игры: загадки, пазлы, счёт в магазине. Мозг ребёнка обучается через удовольствие, а не через стресс.', type: 'article', createdAt: ago(7) },
    { title: '5 ошибок при подготовке к ЕГЭ по математике', body: 'Ошибка 1: начинать поздно. Ошибка 2: решать только лёгкие задания. Ошибка 3: игнорировать разбор ошибок. Ошибка 4: зубрить формулы без понимания. Ошибка 5: не тренировать тайм-менеджмент. Каждый пункт разбираю подробно с примерами из практики.', type: 'article', createdAt: ago(14) },
    { title: 'Правило 20 минут для домашнего задания', body: 'Если ребёнок не может решить задачу за 20 минут — это не его проблема, это сигнал о пробеле в знаниях. Не сидите рядом и не подсказывайте. Лучше запишите задачу и покажите репетитору: именно такие «застрявшие» задачи — самые ценные для работы.', type: 'tip', createdAt: ago(3) },
  ];
  if (email === 'garcia.sochi@example.ru') return [
    { title: 'Почему испанский легче, чем вам кажется', body: 'Испанский — один из самых простых европейских языков для русскоязычных. Фонетически прозрачен: как написано, так и читается. Грамматика логична. Уже через 2–3 месяца занятий вы сможете объясниться в любом испаноязычном городе. Секрет — говорить с первого занятия, не ждать «пока выучу».', type: 'article', createdAt: ago(5) },
    { title: 'Совет: учите испанский через музыку', body: 'Лучший способ запомнить слова и интонацию — слушать испаноязычную музыку. Reggaeton, Flamenco, Latin pop — выберите жанр по вкусу и начните разбирать тексты. Я даю ученикам разбор одной песни в месяц как домашнее задание.', type: 'tip', createdAt: ago(10) },
  ];
  if (spec.includes('английск') || spec.includes('язык')) return [
    { title: 'Как выбрать метод обучения иностранному языку для ребёнка', body: 'Коммуникативный, грамматико-переводной, аудио-лингвальный — методов много. Для детей до 10 лет лучше всего работает игровой и погружательный подход. Старших школьников эффективнее учить через реальные задачи: переписка, видео, проекты.', type: 'article', createdAt: ago(8) },
    { title: 'Совет: смотрите мультфильмы на языке', body: 'Самый простой способ практиковать язык дома — включить любимые мультфильмы на иностранном языке. Начните с субтитрами на том же языке, постепенно убирайте подсказки.', type: 'tip', createdAt: ago(4) },
  ];
  if (spec.includes('рисов') || spec.includes('живопись')) return [
    { title: 'Как понять, есть ли у ребёнка художественные способности', body: 'Многие родители ждут «таланта» прежде чем отдать ребёнка рисовать. Но художественное мышление — навык, а не врождённое свойство. Если ребёнку нравится создавать руками что-то новое — это уже достаточный повод начать. Занятия рисованием развивают не только рисование.', type: 'article', createdAt: ago(9) },
    { title: 'Совет: заведите папку для работ', body: 'Сохраняйте все рисунки ребёнка в хронологическом порядке. Через полгода занятий вы увидите прогресс, который вдохновит и ребёнка, и вас. Это лучшая мотивация продолжать.', type: 'tip', createdAt: ago(2) },
  ];
  return [
    { title: 'Как сделать занятия эффективными', body: 'Главное в обучении — регулярность и включённость. 20–30 минут ежедневной практики дают больше, чем редкие многочасовые марафоны. Поддерживайте интерес ребёнка, хвалите прогресс, а не только результат.', type: 'tip', createdAt: ago(6) },
  ];
}

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

  const demoServices = getDemoServicesForEmail(educator.user.email, educator.specializations);
  const demoPosts = getDemoPostsForEmail(educator.user.email, educator.specializations);

  res.json({ success: true, data: { ...educator, avgRating, reviewCount: educator.reviews.length, demoServices, demoPosts } });
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
