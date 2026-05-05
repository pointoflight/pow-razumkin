'use client';

import { useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const ORG_TYPES = [
  { value: 'kindergarten', label: 'Детский сад' },
  { value: 'school', label: 'Школа' },
  { value: 'center', label: 'Центр развития' },
  { value: 'sports_club', label: 'Спортивная секция' },
  { value: 'music', label: 'Музыка и творчество' },
  { value: 'art', label: 'Художественная школа' },
  { value: 'language', label: 'Языковой центр' },
  { value: 'tutoring', label: 'Репетиторство' },
  { value: 'other', label: 'Другое' },
];

interface Org {
  id: string;
  name: string;
  description?: string;
  type: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export default function ProfilePage() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [editing, setEditing] = useState<Org | null>(null);
  const [form, setForm] = useState({ name: '', description: '', type: 'center', address: '', city: '', phone: '', email: '', website: '' });
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/organizations/my/list', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (d.success) setOrgs(d.data); setLoading(false); });
  }, []);

  function startEdit(org: Org) {
    setEditing(org);
    setForm({ name: org.name, description: org.description || '', type: org.type, address: org.address || '', city: org.city || '', phone: org.phone || '', email: org.email || '', website: org.website || '' });
    setCreating(false);
  }

  function startCreate() {
    setEditing(null);
    setForm({ name: '', description: '', type: 'center', address: '', city: '', phone: '', email: '', website: '' });
    setCreating(true);
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    const url = editing ? `/api/organizations/${editing.id}` : '/api/organizations';
    const method = editing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (data.success) {
      setMessage('Сохранено!');
      setEditing(null);
      setCreating(false);
      fetch('/api/organizations/my/list', { credentials: 'include' })
        .then((r) => r.json())
        .then((d) => { if (d.success) setOrgs(d.data); });
    } else {
      setMessage(data.error || 'Ошибка');
    }
    setSaving(false);
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Загрузка...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Профиль организации</h1>
        <Button onClick={startCreate} size="sm">+ Добавить организацию</Button>
      </div>

      {/* Organization list */}
      {orgs.length > 0 && !creating && !editing && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {orgs.map((org) => (
            <div key={org.id} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-0">
              <div>
                <div className="font-medium text-gray-900">{org.name}</div>
                <div className="text-sm text-gray-500">{org.city}</div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => startEdit(org)}>Редактировать</Button>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create form */}
      {(editing || creating) && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-5">{editing ? 'Редактирование организации' : 'Новая организация'}</h2>
          <div className="space-y-4">
            <Input label="Название организации *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Тип организации *</label>
              <select
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {ORG_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Описание</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Расскажите о вашей организации..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Город" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Москва" />
              <Input label="Адрес" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="ул. Ленина, 1" />
              <Input label="Телефон" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+7 495 000-00-00" />
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="info@example.ru" />
              <Input label="Сайт" type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://example.ru" className="col-span-full sm:col-span-2" />
            </div>

            {message && <p className={`text-sm ${message === 'Сохранено!' ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}

            <div className="flex gap-3">
              <Button onClick={handleSave} loading={saving}>Сохранить</Button>
              <Button variant="ghost" onClick={() => { setEditing(null); setCreating(false); }}>Отмена</Button>
            </div>
          </div>
        </div>
      )}

      {!creating && !editing && orgs.length === 0 && (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-xl">
          <div className="text-5xl mb-4">🏢</div>
          <p className="text-gray-600 mb-5">Нажмите «Добавить организацию», чтобы создать свой профиль на платформе</p>
        </div>
      )}
    </div>
  );
}
