import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import OrganizationCard from '@/components/marketplace/OrganizationCard';
import { serverFetch } from '@/lib/api';
import AiSearch from '@/components/AiSearch';

const CATEGORIES = [
  { key: 'kindergarten', icon: '🏠', color: 'bg-green-50 border-green-200 text-green-700' },
  { key: 'school', icon: '📚', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { key: 'center', icon: '🎯', color: 'bg-orange-50 border-orange-200 text-orange-700' },
  { key: 'sports_club', icon: '⚽', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { key: 'music', icon: '🎵', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { key: 'language', icon: '🌍', color: 'bg-teal-50 border-teal-200 text-teal-700' },
  { key: 'tutoring', icon: '✏️', color: 'bg-pink-50 border-pink-200 text-pink-700' },
  { key: 'art', icon: '🎨', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
];

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const [t, tc, result] = await Promise.all([
    getTranslations({ locale, namespace: 'home' }),
    getTranslations({ locale, namespace: 'categories' }),
    serverFetch<{ data: unknown[] }>('/api/organizations?limit=6'),
  ]);

  const orgs = (result.data as unknown[] | undefined) ?? [];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{t('hero_title')}</h1>
          <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">{t('hero_subtitle')}</p>
          <form action={`/${locale}/search`} method="get" className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <input
              name="q"
              type="text"
              placeholder={t('search_placeholder')}
              className="flex-1 px-5 py-4 rounded-xl text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 shadow-lg"
            />
            <input
              name="city"
              type="text"
              placeholder={t('search_city')}
              className="sm:w-40 px-5 py-4 rounded-xl text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 shadow-lg"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors shadow-lg whitespace-nowrap"
            >
              {t('search_button')}
            </button>
          </form>
        </div>
      </section>

      {/* AI Search section */}
      <section className="py-8 px-4 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <AiSearch locale={locale} />
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-7">{t('categories_title')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                href={`/${locale}/search?type=${cat.key}`}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${cat.color} hover:shadow-md transition-all duration-200 text-center`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium leading-tight">{tc(cat.key as 'kindergarten')}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured organizations */}
      <section className="py-12 px-4 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-2xl font-bold text-gray-900">{t('featured_title')}</h2>
            <Link href={`/${locale}/search`} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              {locale === 'ru' ? 'Смотреть все →' : 'View all →'}
            </Link>
          </div>
          {orgs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(orgs as Parameters<typeof OrganizationCard>[0]['org'][]).map((org) => (
                <OrganizationCard key={(org as { id: string }).id} org={org as Parameters<typeof OrganizationCard>[0]['org']} locale={locale} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-12">
              {locale === 'ru' ? 'Организации пока не добавлены' : 'No organizations yet'}
            </p>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">{t('how_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(['1', '2', '3'] as const).map((n) => (
              <div key={n} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {n}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{t(`how_${n}_title` as 'how_1_title')}</h3>
                <p className="text-sm text-gray-600">{t(`how_${n}_text` as 'how_1_text')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
