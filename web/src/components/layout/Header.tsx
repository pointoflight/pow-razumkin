'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

interface User {
  id: string;
  name: string;
  role: string;
}

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const locale = pathname.startsWith('/en') ? 'en' : 'ru';
  const isEn = locale === 'en';

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    fetch('/api/auth/me', { credentials: 'include', signal: controller.signal })
      .then((r) => r.json())
      .then((d) => { if (d.success) setUser(d.data); else setUser(null); })
      .catch(() => {})
      .finally(() => clearTimeout(timeout));
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    router.push(`/${locale}`);
  }

  function switchLocale() {
    const newLocale = locale === 'ru' ? 'en' : 'ru';
    const pathWithoutLocale = pathname.replace(/^\/(ru|en)/, '') || '/';
    router.push(`/${newLocale}${pathWithoutLocale}`);
  }

  const dashboardPath = user?.role === 'admin'
    ? `/${locale}/admin`
    : user?.role === 'business_owner'
    ? `/${locale}/dashboard`
    : user?.role === 'educator'
    ? `/${locale}/educator-dashboard`
    : `/${locale}/account`;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600">EduMarket</span>
            <span className="hidden sm:block text-xs text-gray-500 font-medium mt-1">edu</span>
          </Link>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href={`/${locale}/search`} className="text-sm text-gray-700 hover:text-primary-600 font-medium transition-colors">
              {t('organizations')}
            </Link>
            <Link href={`/${locale}/educators`} className="text-sm text-gray-700 hover:text-primary-600 font-medium transition-colors">
              {t('educators')}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Locale toggle */}
            <button
              onClick={switchLocale}
              className="text-xs font-semibold px-2 py-1 rounded border border-gray-300 text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
            >
              {locale === 'ru' ? 'EN' : 'RU'}
            </button>

            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600 font-medium"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block">{user.name}</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <Link href={dashboardPath} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                      {user.role === 'parent' ? t('account') : t('dashboard')}
                    </Link>
                    {user.role === 'admin' && (
                      <Link href={`/${locale}/admin`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                        {t('admin')}
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href={`/${locale}/auth/login`} className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                  {t('login')}
                </Link>
                <Link
                  href={`/${locale}/auth/register`}
                  className="hidden sm:block text-sm font-medium px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {t('register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
