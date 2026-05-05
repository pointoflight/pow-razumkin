'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface Props {
  locale: string;
}

export default function RegisterForm({ locale }: Props) {
  const t = useTranslations('auth');
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '', role: 'parent' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      const role = data.data?.role;
      if (role === 'business_owner') router.push(`/${locale}/dashboard`);
      else if (role === 'educator') router.push(`/${locale}/educator-dashboard`);
      else router.push(`/${locale}/account`);
    } else {
      setError(data.error || 'Ошибка регистрации');
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{t('register_title')}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">{t('role')}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'parent', label: t('role_parent') },
                  { value: 'business_owner', label: t('role_business') },
                  { value: 'educator', label: t('role_educator') },
                ].map((r) => (
                  <label
                    key={r.value}
                    className={`flex items-center justify-center px-3 py-2.5 border rounded-lg text-sm font-medium cursor-pointer transition-all ${form.role === r.value ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-600 hover:border-primary-300'}`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={form.role === r.value}
                      onChange={() => setForm({ ...form, role: r.value })}
                      className="sr-only"
                    />
                    {r.label}
                  </label>
                ))}
              </div>
            </div>

            <Input
              label={t('name')}
              placeholder="Иван Иванов"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
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
              placeholder="Минимум 8 символов"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Input
              label={t('phone')}
              type="tel"
              placeholder="+7 900 000-00-00"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              {t('register_btn')}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            {t('has_account')}{' '}
            <Link href={`/${locale}/auth/login`} className="text-primary-600 font-medium hover:underline">
              {t('login_link')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
