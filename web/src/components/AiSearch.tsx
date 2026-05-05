'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AiResult {
  rank: number;
  id: string;
  type: 'organization' | 'educator';
  name: string;
  description?: string;
  bio?: string;
  city?: string;
  category?: string;
  specializations?: string[];
  minPrice?: number | null;
  maxPrice?: number | null;
  avgRating?: number | null;
  reviewCount?: number;
  reason: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  school: 'Школа', kindergarten: 'Детский сад', center: 'Центр развития',
  sports_club: 'Спортивная секция', music: 'Музыка', art: 'Творчество',
  language: 'Иностранные языки', tutoring: 'Репетиторство', other: 'Другое',
};

const EXAMPLE_QUERIES = [
  'Ищу в Сочи место, где ребёнок 8 лет сможет выучить испанский язык. Бюджет до 20 000 рублей в месяц.',
  'Нужны занятия теннисом для мальчика 8 лет в Санкт-Петербурге, хотим профессионального тренера.',
  'Дочке 10 лет, хочет серьёзно заниматься рисованием и живописью в Казани. Что посоветуете?',
];

interface Props {
  locale: string;
}

export default function AiSearch({ locale }: Props) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AiResult[] | null>(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  async function handleSearch(q?: string) {
    const finalQuery = (q ?? query).trim();
    if (!finalQuery) return;
    setQuery(finalQuery);
    setLoading(true);
    setError('');
    setResults(null);
    setSearched(true);

    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ query: finalQuery }),
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error ?? 'Ошибка поиска');
      }
    } catch {
      setError('Не удалось связаться с сервером');
    } finally {
      setLoading(false);
    }
  }

  function formatPrice(min?: number | null, max?: number | null) {
    if (!min && !max) return null;
    if (min === max) return `от ${min?.toLocaleString('ru-RU')} ₽`;
    return `от ${min?.toLocaleString('ru-RU')} ₽`;
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-violet-100 to-indigo-100 border border-violet-200 rounded-full">
          <span className="text-sm">✨</span>
          <span className="text-xs font-semibold text-violet-700">AI-поиск</span>
        </div>
        <span className="text-sm text-gray-500">Опишите, что вы ищете — AI подберёт лучшие варианты</span>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch(); } }}
          placeholder="Например: ищу теннисный клуб для 9-летней дочери в Санкт-Петербурге, бюджет до 6000 руб/мес..."
          rows={2}
          className="flex-1 px-4 py-3 border border-violet-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white resize-none placeholder-gray-400"
        />
        <button
          onClick={() => handleSearch()}
          disabled={loading || !query.trim()}
          className="px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-md self-start mt-0"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Ищу...
            </span>
          ) : 'Найти с AI'}
        </button>
      </div>

      {/* Example queries */}
      {!searched && (
        <div className="mt-3">
          <p className="text-xs text-gray-400 mb-2">Примеры запросов:</p>
          <div className="flex flex-col gap-1.5">
            {EXAMPLE_QUERIES.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSearch(q)}
                className="text-left text-xs text-violet-600 hover:text-violet-800 hover:underline leading-snug"
              >
                → {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      {/* Results */}
      {results !== null && (
        <div className="mt-5">
          {results.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-500">AI не нашёл подходящих вариантов по вашему запросу.</p>
              <p className="text-sm text-gray-400 mt-1">Попробуйте изменить запрос или город.</p>
            </div>
          ) : (
            <>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                AI подобрал {results.length} {results.length === 1 ? 'вариант' : results.length < 5 ? 'варианта' : 'вариантов'}:
              </h3>
              <div className="space-y-3">
                {results.map((item) => {
                  const href = item.type === 'organization'
                    ? `/${locale}/organizations/${item.id}`
                    : `/${locale}/educators/${item.id}`;
                  const priceStr = formatPrice(item.minPrice, item.maxPrice);
                  const tagLine = item.type === 'organization'
                    ? CATEGORY_LABELS[item.category ?? ''] ?? item.category
                    : 'Педагог';
                  const preview = item.type === 'organization'
                    ? (item.description ?? '').slice(0, 100)
                    : (item.bio ?? '').slice(0, 100);

                  return (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-violet-300 hover:shadow-sm transition-all">
                      <div className="flex items-start gap-3">
                        {/* Rank badge */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-sm font-bold flex items-center justify-center shadow-sm">
                          {item.rank}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <Link href={href} className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                                {item.name}
                              </Link>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{tagLine}</span>
                                {item.city && <span className="text-xs text-gray-500">{item.city}</span>}
                                {item.avgRating && (
                                  <span className="text-xs text-yellow-600 font-medium">★ {item.avgRating} ({item.reviewCount})</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              {priceStr && <div className="text-sm font-semibold text-primary-600">{priceStr}</div>}
                              <Link
                                href={href}
                                className="text-xs text-violet-600 hover:text-violet-800 font-medium mt-0.5 block"
                              >
                                Открыть →
                              </Link>
                            </div>
                          </div>

                          {/* AI explanation */}
                          <div className="mt-2 p-2.5 bg-violet-50 border border-violet-100 rounded-lg">
                            <p className="text-xs text-violet-800 leading-relaxed">
                              <span className="font-semibold">AI: </span>{item.reason}
                            </p>
                          </div>

                          {/* Preview text */}
                          {preview && (
                            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">{preview}…</p>
                          )}

                          {/* Specializations for educators */}
                          {item.type === 'educator' && item.specializations && item.specializations.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.specializations.slice(0, 4).map((s) => (
                                <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <button
            onClick={() => { setResults(null); setSearched(false); setQuery(''); }}
            className="mt-4 text-sm text-gray-400 hover:text-gray-600"
          >
            ← Новый запрос
          </button>
        </div>
      )}
    </div>
  );
}
