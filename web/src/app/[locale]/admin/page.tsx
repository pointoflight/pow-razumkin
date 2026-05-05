'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';

interface Stats { users: number; organizations: number; leads: number; pendingOrgs: number }
interface PendingOrg { id: string; name: string; type: string; city?: string; createdAt: string; owner: { name: string; email: string; phone?: string } }

const TYPE_LABELS: Record<string, string> = {
  school: 'Школа', kindergarten: 'Детский сад', center: 'Центр', sports_club: 'Спорт',
  music: 'Музыка', art: 'Искусство', language: 'Языки', tutoring: 'Репетиторство', other: 'Другое',
};

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pending, setPending] = useState<PendingOrg[]>([]);
  const [loading, setLoading] = useState(true);

  function fetchData() {
    Promise.all([
      fetch('/api/admin/stats', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/admin/organizations/pending', { credentials: 'include' }).then((r) => r.json()),
    ]).then(([statsData, pendingData]) => {
      if (statsData.success) setStats(statsData.data);
      if (pendingData.success) setPending(pendingData.data);
      setLoading(false);
    });
  }

  useEffect(() => { fetchData(); }, []);

  async function handleVerify(id: string, verified: boolean) {
    await fetch(`/api/admin/organizations/${id}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ verified }),
    });
    setPending((prev) => prev.filter((o) => o.id !== id));
    if (stats) setStats({ ...stats, pendingOrgs: stats.pendingOrgs - 1 });
  }

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-12 text-center text-gray-500">Загрузка...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Пользователей', value: stats.users, color: 'text-blue-600' },
            { label: 'Организаций', value: stats.organizations, color: 'text-green-600' },
            { label: 'Заявок', value: stats.leads, color: 'text-orange-600' },
            { label: 'На проверке', value: stats.pendingOrgs, color: 'text-yellow-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Pending organizations */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Организации на проверке
          {pending.length > 0 && <span className="ml-2 text-sm font-normal text-gray-500">({pending.length})</span>}
        </h2>

        {pending.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-gray-500">Нет организаций, ожидающих проверки</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((org) => (
              <div key={org.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{org.name}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{TYPE_LABELS[org.type] || org.type}</span>
                    </div>
                    {org.city && <p className="text-sm text-gray-500 mt-0.5">{org.city}</p>}
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Владелец:</span> {org.owner.name} — {org.owner.email}
                      {org.owner.phone && ` · ${org.owner.phone}`}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Подана {new Date(org.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" onClick={() => handleVerify(org.id, true)}>Одобрить</Button>
                    <Button size="sm" variant="danger" onClick={() => handleVerify(org.id, false)}>Отклонить</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
