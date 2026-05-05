import { getTranslations } from 'next-intl/server';
import OrganizationCard from '@/components/marketplace/OrganizationCard';
import { serverFetch } from '@/lib/api';
import Link from 'next/link';

const TYPES = [
  { value: '', label: 'Все категории' },
  { value: 'kindergarten', label: 'Детские сады' },
  { value: 'school', label: 'Школы' },
  { value: 'center', label: 'Центры развития' },
  { value: 'sports_club', label: 'Спортивные секции' },
  { value: 'music', label: 'Музыка и творчество' },
  { value: 'art', label: 'Художественные школы' },
  { value: 'language', label: 'Иностранные языки' },
  { value: 'tutoring', label: 'Репетиторы' },
  { value: 'other', label: 'Другое' },
];

interface SearchPageProps {
  params: { locale: string };
  searchParams: { q?: string; type?: string; city?: string; page?: string };
}

interface OrgResult {
  id: string;
  name: string;
  description?: string | null;
  type: string;
  city?: string | null;
  logoUrl?: string | null;
  isVerified: boolean;
  avgRating?: number | null;
  reviewCount?: number;
  services?: Array<{ priceFrom?: number | null; priceTo?: number | null }>;
  _count?: { services: number };
}

interface ApiResponse {
  success: boolean;
  data?: OrgResult[];
  pagination?: { total: number; totalPages: number; page: number };
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const t = await getTranslations('search');
  const locale = params.locale;
  const { q = '', type = '', city = '', page = '1' } = searchParams;

  const query = new URLSearchParams();
  if (q) query.set('q', q);
  if (type) query.set('type', type);
  if (city) query.set('city', city);
  query.set('page', page);

  const result = await serverFetch<ApiResponse>(`/api/organizations?${query}`);
  const orgs: OrgResult[] = (result as { data?: OrgResult[] }).data ?? [];
  const pagination = (result as { pagination?: { total: number; totalPages: number; page: number } }).pagination;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4">{t('filters')}</h2>

            <form method="get">
              {q && <input type="hidden" name="q" value={q} />}
              {city && <input type="hidden" name="city" value={city} />}

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('category')}</label>
                {TYPES.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 py-1.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="type"
                      value={opt.value}
                      defaultChecked={type === opt.value}
                      className="accent-primary-600"
                    />
                    <span className={`text-sm ${type === opt.value ? 'text-primary-600 font-medium' : 'text-gray-600'} group-hover:text-primary-600 transition-colors`}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('city')}</label>
                <input
                  type="text"
                  name="city"
                  defaultValue={city}
                  placeholder="Москва"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <button type="submit" className="w-full py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
                Применить
              </button>
            </form>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Search bar */}
          <form method="get" className="flex gap-3 mb-6">
            {type && <input type="hidden" name="type" value={type} />}
            {city && <input type="hidden" name="city" value={city} />}
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Название организации или ключевое слово..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            />
            <button type="submit" className="px-6 py-3 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors">
              Найти
            </button>
          </form>

          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl font-bold text-gray-900">
              {q ? `«${q}»` : t('results')}
              {pagination && (
                <span className="text-sm font-normal text-gray-500 ml-2">— {t('found', { count: pagination.total })}</span>
              )}
            </h1>
          </div>

          {orgs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {orgs.map((org) => <OrganizationCard key={org.id} org={org} locale={locale} />)}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
                    const sp = new URLSearchParams(searchParams as Record<string, string>);
                    sp.set('page', String(p));
                    return (
                      <Link
                        key={p}
                        href={`/${locale}/search?${sp}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === parseInt(page) ? 'bg-primary-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:border-primary-400'}`}
                      >
                        {p}
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg">{t('no_results')}</p>
              <Link href={`/${locale}/search`} className="mt-4 inline-block text-primary-600 hover:underline text-sm">
                Сбросить фильтры
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
