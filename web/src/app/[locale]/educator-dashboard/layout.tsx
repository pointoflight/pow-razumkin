import Link from 'next/link';
import { getLocale } from 'next-intl/server';

export default async function EducatorDashboardLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  const NAV = [
    { href: `/${locale}/educator-dashboard`, label: 'Обзор', icon: '📊' },
    { href: `/${locale}/educator-dashboard/leads`, label: 'Заявки', icon: '💬' },
    { href: `/${locale}/educator-dashboard/profile`, label: 'Мой профиль', icon: '👤' },
    { href: `/${locale}/educator-dashboard/content`, label: 'Публикации', icon: '✍️' },
    { href: `/${locale}/educator-dashboard/services`, label: 'Услуги', icon: '📚' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 flex-shrink-0">
          <nav className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-4 bg-primary-600">
              <p className="text-white text-xs font-medium uppercase tracking-wide">Кабинет педагога</p>
            </div>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors border-b border-gray-100 last:border-0"
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-700 mb-1">Публичная страница</p>
            <p className="text-xs text-blue-600 mb-3">Так вас видят родители</p>
            <Link href={`/${locale}/educators`} className="text-xs text-blue-700 underline hover:text-blue-800">
              Смотреть →
            </Link>
          </div>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
