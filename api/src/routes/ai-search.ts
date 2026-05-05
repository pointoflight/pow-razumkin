import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const aiSearchRouter = Router();

const DEEPSEEK_API_KEY = 'sk-9a7da6b38f72444caa37597b422daefd';
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

aiSearchRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  const { query } = req.body as { query?: string };

  if (!query || typeof query !== 'string' || query.trim().length < 5) {
    res.status(400).json({ success: false, error: 'Введите поисковый запрос (минимум 5 символов)' });
    return;
  }

  try {
    const [organizations, educators] = await Promise.all([
      prisma.organization.findMany({
        where: { isActive: true },
        include: {
          services: { where: { isActive: true }, select: { nameRu: true, priceFrom: true, priceTo: true, ageFrom: true, ageTo: true } },
          reviews: { where: { isModerated: true }, select: { rating: true } },
        },
      }),
      prisma.educatorProfile.findMany({
        where: { isActive: true },
        include: {
          user: { select: { name: true } },
          reviews: { where: { isModerated: true }, select: { rating: true } },
        },
      }),
    ]);

    const orgItems = organizations.map((org) => {
      const prices = org.services.flatMap((s) => [s.priceFrom, s.priceTo].filter(Boolean) as number[]);
      return {
        id: org.id,
        type: 'organization' as const,
        name: org.name,
        description: (org.description ?? '').slice(0, 180),
        category: org.type,
        city: org.city ?? '',
        services: org.services.map((s) => ({
          name: s.nameRu,
          priceFrom: s.priceFrom,
          priceTo: s.priceTo,
          ageFrom: s.ageFrom,
          ageTo: s.ageTo,
        })),
        minPrice: prices.length ? Math.min(...prices) : null,
        maxPrice: prices.length ? Math.max(...prices) : null,
        avgRating: org.reviews.length
          ? +(org.reviews.reduce((s, r) => s + r.rating, 0) / org.reviews.length).toFixed(1)
          : null,
        reviewCount: org.reviews.length,
      };
    });

    const eduItems = educators.map((edu) => ({
      id: edu.id,
      type: 'educator' as const,
      name: edu.user.name,
      bio: (edu.bio ?? '').slice(0, 180),
      specializations: edu.specializations,
      city: edu.city ?? '',
      avgRating: edu.reviews.length
        ? +(edu.reviews.reduce((s, r) => s + r.rating, 0) / edu.reviews.length).toFixed(1)
        : null,
      reviewCount: edu.reviews.length,
    }));

    const allItems = [...orgItems, ...eduItems];

    const prompt = `Ты — умный помощник образовательной платформы «Разумкин» (Россия).
Родитель ищет образовательные услуги для ребёнка. Твоя задача — найти лучшие совпадения из базы данных.

Доступные варианты (JSON):
${JSON.stringify(allItems)}

Запрос родителя: "${query.trim()}"

Верни ТОЛЬКО JSON-массив из не более 5 объектов (меньше, если хороших совпадений меньше), отсортированных от лучшего к худшему.
Каждый объект должен содержать:
- "id": точный id из списка выше
- "type": "organization" или "educator"
- "reason": 2–3 предложения на русском, почему это хороший вариант для данного запроса

Критерии подбора: город (важнее всего), предмет/направление, возраст ребёнка, бюджет, формат.
Верни ТОЛЬКО валидный JSON-массив, без markdown и без лишнего текста.`;

    const aiResponse = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 1200,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error('DeepSeek API error:', aiResponse.status, errText);
      res.status(502).json({ success: false, error: 'Ошибка AI-сервиса, попробуйте позже' });
      return;
    }

    const aiData = await aiResponse.json() as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const rawContent = aiData.choices?.[0]?.message?.content ?? '';

    // Strip markdown code fences if present
    const jsonStr = rawContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    let ranked: Array<{ id: string; type: string; reason: string }> = [];
    try {
      ranked = JSON.parse(jsonStr);
    } catch {
      console.error('Failed to parse AI response:', jsonStr);
      res.status(502).json({ success: false, error: 'AI вернул неожиданный формат, попробуйте ещё раз' });
      return;
    }

    // Enrich each result with full object data
    const itemMap = new Map(allItems.map((i) => [i.id, i]));
    const results = ranked
      .filter((r) => itemMap.has(r.id))
      .map((r, index) => ({
        rank: index + 1,
        ...itemMap.get(r.id)!,
        reason: r.reason,
      }));

    res.json({ success: true, data: results });
  } catch (err) {
    console.error('AI search error:', err);
    res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
  }
});
