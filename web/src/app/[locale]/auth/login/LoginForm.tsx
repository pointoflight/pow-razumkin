'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface Props {
  locale: string;
  from: string;
}

export default function LoginForm({ locale, from }: Props) {
  const t = useTranslations('auth');
  const router = useRouter();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      const role = data.data?.role;
      if (role === 'admin') router.push(`/${locale}/admin`);
      else if (role === 'business_owner') router.push(`/${locale}/dashboard`);
      else if (role === 'educator') router.push(`/${locale}/educator-dashboard`);
      else if (role === 'parent') router.push(`/${locale}/account`);
      else router.push(from);
    } else {
      setError(data.error || 'Ошибка входа');
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{t('login_title')}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('email')}
              type="email"
              placeholder="example@mail.ru"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label={t('password')}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              {t('login_btn')}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            {t('no_account')}{' '}
            <Link href={`/${locale}/auth/register`} className="text-primary-600 font-medium hover:underline">
              {t('register_link')}
            </Link>
          </p>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 font-medium mb-2">Демо аккаунты:</p>
            <div className="space-y-1 text-xs text-gray-500">
              <div>Родитель: parent@example.ru / Pass1234!</div>
              <div>Педагог: teacher@example.ru / Pass1234!</div>
              <div>Организация: akademiya@example.ru / Pass1234!</div>
              <div>Админ: admin@example.ru / Admin1234!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
