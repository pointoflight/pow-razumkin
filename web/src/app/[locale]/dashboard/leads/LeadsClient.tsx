'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';

const STATUSES = [
  { value: '', label: 'Все' },
  { value: 'new', label: 'Новые', color: 'bg-blue-100 text-blue-800' },
  { value: 'contacted', label: 'Связались', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'in_progress', label: 'В обработке', color: 'bg-orange-100 text-orange-800' },
  { value: 'converted', label: 'Записан', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Отказ', color: 'bg-red-100 text-red-800' },
];

interface Lead {
  id: string;
  parentName: string;
  parentPhone: string;
  message?: string | null;
  notes?: string | null;
  status: string;
  createdAt: string;
  organization?: { id: string; name: string } | null;
  service?: { nameRu: string } | null;
  child?: { name: string; birthDate?: string | null } | null;
}

interface Props {
  orgId: string;
}

export default function LeadsClient({ orgId }: Props) {
  const [statusFilter, setStatusFilter] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  function fetchLeads() {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (orgId) params.set('orgId', orgId);
    setLoading(true);
    fetch(`/api/leads/incoming?${params}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (d.success) setLeads(d.data); setLoading(false); });
  }

  useEffect(() => { fetchLeads(); }, [statusFilter, orgId]);

  function openLead(lead: Lead) {
    setSelected(lead);
    setNewStatus(lead.status);
    setNotes(lead.notes || '');
  }

  async function saveStatus() {
    if (!selected) return;
    setSaving(true);
    const res = await fetch(`/api/leads/${selected.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: newStatus, notes }),
    });
    const data = await res.json();
    if (data.success) {
      setLeads((prev) => prev.map((l) => l.id === selected.id ? { ...l, status: newStatus, notes } : l));
      setSelected(null);
    }
    setSaving(false);
  }

  const getStatusStyle = (status: string) => STATUSES.find((s) => s.value === status)?.color || 'bg-gray-100 text-gray-700';
  const getStatusLabel = (status: string) => STATUSES.find((s) => s.value === status)?.label || status;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Заявки</h1>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${statusFilter === s.value ? 'bg-primary-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:border-primary-400'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Загрузка...</div>
      ) : leads.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-xl">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-gray-500">Заявок пока нет</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Родитель</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 hidden md:table-cell">Услуга</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 hidden lg:table-cell">Дата</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Статус</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-gray-900">{lead.parentName}</div>
                    <div className="text-gray-500 text-xs">{lead.parentPhone}</div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell text-gray-600">
                    {lead.service?.nameRu || '—'}
                    {lead.child && <div className="text-xs text-gray-400">Ребёнок: {lead.child.name}</div>}
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(lead.status)}`}>
                      {getStatusLabel(lead.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => openLead(lead)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Открыть
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Заявка от {selected.parentName}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex gap-4">
                <div><span className="text-gray-500">Телефон:</span> <a href={`tel:${selected.parentPhone}`} className="text-primary-600 font-medium">{selected.parentPhone}</a></div>
              </div>
              {selected.service && <div><span className="text-gray-500">Услуга:</span> {selected.service.nameRu}</div>}
              {selected.child && (
                <div>
                  <span className="text-gray-500">Ребёнок:</span> {selected.child.name}
                  {selected.child.birthDate && ` (${new Date(selected.child.birthDate).toLocaleDateString('ru-RU')})`}
                </div>
              )}
              {selected.message && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-500 block mb-1">Сообщение:</span>
                  <p className="text-gray-800">{selected.message}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Изменить статус</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {STATUSES.filter((s) => s.value).map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Заметки</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Внутренние заметки по заявке..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <Button onClick={saveStatus} loading={saving} className="flex-1">Сохранить</Button>
              <Button variant="ghost" onClick={() => setSelected(null)} className="flex-1">Отмена</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
