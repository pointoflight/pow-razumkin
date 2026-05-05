'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface User {
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export default function AccountPage() {
  const pathname = usePathname();
  const locale = pathname.startsWith('/en') ? 'en' : 'ru';
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (d.success) setUser(d.data); });
  }, []);

  if (!user) return <div className="text-center py-12 text-gray-500">Загрузка...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Мой аккаунт</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            {user.phone && <p className="text-gray-500 text-sm">{user.phone}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href={`/${locale}/account/children`} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-sm transition-all">
          <div className="text-3xl mb-2">👧</div>
          <h3 className="font-semibold text-gray-900">Мои дети</h3>
          <p className="text-sm text-gray-500 mt-1">Управляйте профилями детей</p>
        </Link>
        <Link href={`/${locale}/account/requests`} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-sm transition-all">
          <div className="text-3xl mb-2">📋</div>
          <h3 className="font-semibold text-gray-900">Мои заявки</h3>
          <p className="text-sm text-gray-500 mt-1">Отслеживайте статус заявок</p>
        </Link>
      </div>
    </div>
  );
}
