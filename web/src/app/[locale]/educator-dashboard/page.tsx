'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Profile {
  id: string;
  bio: string | null;
  specializations: string[];
  experienceYears: number | null;
  city: string | null;
  isActive: boolean;
  reviews: Array<{ rating: number }>;
}

interface Lead {
  id: string;
  parentName: string;
  parentPhone: string;
  status: string;
  message: string | null;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Новая', contacted: 'Связались', in_progress: 'В обработке',
  converted: 'Записан', rejected: 'Отказ',
};
const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800', contacted: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-orange-100 text-orange-800', converted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function EducatorDashboardPage() {
  const pathname = usePathname();
  const locale = pathname.startsWith('/en') ? 'en' : 'ru';
  const [profile, setProfile] = useState<Profile | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/educators/my/profile', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/educators/my/leads', { credentials: 'include' }).then((r) => r.json()),
    ]).then(([profileData, leadsData]) => {
      if (profileData.success) setProfile(profileData.data);
      if (leadsData.success) setLeads(leadsData.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">Загрузка...</div>;

  const avgRating = profile?.reviews?.length
    ? Math.round((profile.reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / profile.reviews.length) * 10) / 10
    : null;
  const newLeads = leads.filter((l) => l.status === 'new').length;
  const completeness = profile
    ? [profile.bio, profile.city, profile.experienceYears, profile.specializations.length > 0].filter(Boolean).length * 25
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Обзор</h1>
        {newLeads > 0 && (
          <Link href={`/${locale}/educator-dashboard/leads`} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-200 hover:bg-blue-100">
            <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-bold">{newLeads}</span>
            новых заявки
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Заявок всего', value: leads.length, color: 'text-primary-600' },
          { label: 'Новых', value: newLeads, color: 'text-blue-600' },
          { label: 'Рейтинг', value: avgRating ? `${avgRating} ★` : '—', color: 'text-yellow-600' },
          { label: 'Отзывов', value: profile?.reviews?.length ?? 0, color: 'text-green-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Profile completeness */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Полнота профиля</h2>
          <span className="text-sm font-bold text-primary-600">{completeness}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${completeness}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { label: 'Биография', done: !!profile?.bio },
            { label: 'Город', done: !!profile?.city },
            { label: 'Опыт (лет)', done: !!profile?.experienceYears },
            { label: 'Специализации', done: (profile?.specializations?.length ?? 0) > 0 },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-gray-600">
              <span className={item.done ? 'text-green-500' : 'text-gray-300'}>
                {item.done ? '✓' : '○'}
              </span>
              {item.label}
            </div>
          ))}
        </div>
        {completeness < 100 && (
          <Link href={`/${locale}/educator-dashboard/profile`} className="mt-3 block text-sm text-primary-600 hover:text-primary-700">
            Заполнить профиль →
          </Link>
        )}
      </div>

      {/* Recent leads */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Последние заявки</h2>
          <Link href={`/${locale}/educator-dashboard/leads`} className="text-sm text-primary-600 hover:text-primary-700">
            Все заявки →
          </Link>
        </div>
        {leads.length === 0 ? (
          <div className="py-10 text-center text-gray-400 text-sm">
            Пока нет заявок. Родители увидят вас на странице педагогов.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium text-gray-900 text-sm">{lead.parentName}</div>
                  {lead.message && <div className="text-xs text-gray-500 truncate max-w-xs">{lead.message}</div>}
                </div>
                <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status] ?? 'bg-gray-100 text-gray-700'}`}>
                  {STATUS_LABELS[lead.status] ?? lead.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: `/${locale}/educator-dashboard/profile`, icon: '✏️', label: 'Редактировать профиль', desc: 'Обновите биографию и методику' },
          { href: `/${locale}/educator-dashboard/content`, icon: '📝', label: 'Написать статью', desc: 'Поделитесь экспертизой с родителями' },
          { href: `/${locale}/educator-dashboard/services`, icon: '💼', label: 'Управлять услугами', desc: 'Настройте предложения и цены' },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <div className="text-2xl mb-2">{action.icon}</div>
            <div className="font-semibold text-gray-900 text-sm mb-1">{action.label}</div>
            <div className="text-xs text-gray-500">{action.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
