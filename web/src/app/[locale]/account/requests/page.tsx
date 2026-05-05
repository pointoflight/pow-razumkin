'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STATUS_LABELS: Record<string, string> = {
  new: 'Новая', contacted: 'Связались', in_progress: 'В обработке',
  converted: 'Записан', rejected: 'Отказ',
};

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-orange-100 text-orange-800',
  converted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

interface Lead {
  id: string;
  status: string;
  createdAt: string;
  parentName: string;
  message?: string | null;
  organization?: { id: string; name: string; type: string; logoUrl?: string | null } | null;
  service?: { nameRu: string } | null;
}

export default function RequestsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leads/my', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (d.success) setLeads(d.data); setLoading(false); });
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">Загрузка...</div>;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Мои заявки</h1>

      {leads.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-xl">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-gray-500 mb-5">Вы ещё не отправляли заявок</p>
          <Link href="/ru/search" className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
            Найти организацию
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {lead.organization ? (
                    <Link href={`/ru/organizations/${lead.organization.id}`} className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                      {lead.organization.name}
                    </Link>
                  ) : (
                    <span className="font-semibold text-gray-900">Организация</span>
                  )}
                  {lead.service && (
                    <p className="text-sm text-gray-500 mt-0.5">{lead.service.nameRu}</p>
                  )}
                  {lead.message && (
                    <p className="text-sm text-gray-600 mt-2 italic">«{lead.message}»</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(lead.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <span className={`flex-shrink-0 text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[lead.status]}`}>
                  {STATUS_LABELS[lead.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
