'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { usePathname } from 'next/navigation';

interface OrgStats {
  id: string;
  name: string;
  isVerified: boolean;
  _count: { leads: number; services: number };
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-orange-100 text-orange-800',
  converted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
  new: 'Новая', contacted: 'Связались', in_progress: 'В обработке',
  converted: 'Записан', rejected: 'Отказ',
};

export default function DashboardPage() {
  const pathname = usePathname();
  const locale = pathname.startsWith('/en') ? 'en' : 'ru';
  const [orgs, setOrgs] = useState<OrgStats[]>([]);
  const [leads, setLeads] = useState<{ id: string; parentName: string; parentPhone: string; status: string; createdAt: string; organization?: { name: string } }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/organizations/my/list', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/leads/incoming?limit=5', { credentials: 'include' }).then((r) => r.json()),
    ]).then(([orgsData, leadsData]) => {
      if (orgsData.success) setOrgs(orgsData.data);
      if (leadsData.success) setLeads(leadsData.data);
      setLoading(false);
    });
  }, []);

  const totalLeads = orgs.reduce((s, o) => s + o._count.leads, 0);
  const newLeads = leads.filter((l) => l.status === 'new').length;

  if (loading) return <div className="text-gray-500 py-12 text-center">Загрузка...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Обзор</h1>
        <Link href={`/${locale}/dashboard/profile`}>
          <Button variant="primary" size="sm">+ Добавить организацию</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-primary-600">{orgs.length}</div>
          <div className="text-sm text-gray-600 mt-1">Организаций</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-gray-900">{totalLeads}</div>
          <div className="text-sm text-gray-600 mt-1">Всего заявок</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-blue-600">{newLeads}</div>
          <div className="text-sm text-gray-600 mt-1">Новых заявок</div>
        </div>
      </div>

      {/* My organizations */}
      {orgs.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Мои организации</h2>
          </div>
          {orgs.map((org) => (
            <div key={org.id} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-0">
              <div>
                <div className="font-medium text-gray-900">{org.name}</div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {org._count.leads} заявок · {org._count.services} услуг
                  {!org.isVerified && <span className="ml-2 text-yellow-600">· На проверке</span>}
                </div>
              </div>
              <Link href={`/${locale}/dashboard/leads?orgId=${org.id}`}>
                <Button variant="secondary" size="sm">Заявки</Button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">🏢</div>
          <p className="text-gray-600 mb-5">У вас нет организаций. Создайте первую!</p>
          <Link href={`/${locale}/dashboard/profile`}>
            <Button>Создать организацию</Button>
          </Link>
        </div>
      )}

      {/* Recent leads */}
      {leads.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Последние заявки</h2>
            <Link href={`/${locale}/dashboard/leads`} className="text-sm text-primary-600 hover:text-primary-700">
              Все заявки →
            </Link>
          </div>
          {leads.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 last:border-0">
              <div>
                <div className="font-medium text-sm text-gray-900">{lead.parentName}</div>
                <div className="text-xs text-gray-500">{lead.parentPhone}</div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[lead.status]}`}>
                {STATUS_LABELS[lead.status]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
