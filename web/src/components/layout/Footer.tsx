import Link from 'next/link';
import { getLocale } from 'next-intl/server';

export default async function Footer() {
  const locale = await getLocale();

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-3">EduMarket</h3>
            <p className="text-sm">Маркетплейс детского образования. Находите лучшие организации для вашего ребёнка.</p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Навигация</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/search`} className="hover:text-white transition-colors">Поиск организаций</Link></li>
              <li><Link href={`/${locale}/educators`} className="hover:text-white transition-colors">Педагоги</Link></li>
              <li><Link href={`/${locale}/auth/register`} className="hover:text-white transition-colors">Добавить организацию</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Для организаций</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/auth/register`} className="hover:text-white transition-colors">Зарегистрировать организацию</Link></li>
              <li><Link href={`/${locale}/dashboard`} className="hover:text-white transition-colors">Кабинет организации</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs">
          © {new Date().getFullYear()} EduMarket. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
