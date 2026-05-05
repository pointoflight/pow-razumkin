import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { serverFetch } from '@/lib/api';

interface Educator {
  id: string;
  bio?: string | null;
  specializations: string[];
  experienceYears?: number | null;
  photoUrl?: string | null;
  city?: string | null;
  avgRating?: number | null;
  reviewCount: number;
  user: { name: string; email: string };
}

interface ApiResponse {
  data?: Educator[];
  pagination?: { total: number };
}

export default async function EducatorsPage({ params, searchParams }: { params: { locale: string }; searchParams: { q?: string; city?: string } }) {
  const t = await getTranslations('nav');
  const locale = params.locale;
  const { q = '', city = '' } = searchParams;

  const query = new URLSearchParams();
  if (q) query.set('q', q);
  if (city) query.set('city', city);

  const result = await serverFetch<ApiResponse>(`/api/educators?${query}`);
  const educators: Educator[] = (result as { data?: Educator[] }).data ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('educators')}</h1>

      <form method="get" className="flex gap-3 mb-8 max-w-xl">
        <input
          name="q"
          defaultValue={q}
          placeholder="Специализация, имя..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        />
        <input
          name="city"
          defaultValue={city}
          placeholder="Город"
          className="w-36 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        />
        <button type="submit" className="px-5 py-3 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors">
          Найти
        </button>
      </form>

      {educators.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">👨‍🏫</div>
          <p className="text-gray-500">Педагоги пока не зарегистрированы</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {educators.map((educator) => (
            <Link
              key={educator.id}
              href={`/${locale}/educators/${educator.id}`}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xl font-bold flex-shrink-0">
                  {educator.user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{educator.user.name}</h3>
                  {educator.city && <p className="text-sm text-gray-500">{educator.city}</p>}
                </div>
              </div>
              {educator.bio && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{educator.bio}</p>
              )}
              {educator.specializations.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {educator.specializations.slice(0, 3).map((spec) => (
                    <span key={spec} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">{spec}</span>
                  ))}
                </div>
              )}
              {educator.avgRating && (
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium text-gray-700">{educator.avgRating}</span>
                  <span className="text-xs text-gray-400">({educator.reviewCount})</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
