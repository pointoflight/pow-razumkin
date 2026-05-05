'use client';

import { useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface Service {
  id: string;
  nameRu: string;
  descriptionRu?: string | null;
  priceFrom?: number | null;
  priceTo?: number | null;
  ageFrom?: number | null;
  ageTo?: number | null;
  scheduleInfo?: string | null;
  isActive: boolean;
}

interface Org {
  id: string;
  name: string;
}

export default function ServicesPage() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nameRu: '', descriptionRu: '', priceFrom: '', priceTo: '', ageFrom: '', ageTo: '', scheduleInfo: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/organizations/my/list', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data.length > 0) {
          setOrgs(d.data);
          setSelectedOrgId(d.data[0].id);
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedOrgId) return;
    fetch(`/api/services/organization/${selectedOrgId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setServices(d.data); });
  }, [selectedOrgId]);

  async function handleCreate() {
    setSaving(true);
    setMessage('');
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        organizationId: selectedOrgId,
        nameRu: form.nameRu,
        descriptionRu: form.descriptionRu || undefined,
        priceFrom: form.priceFrom ? parseFloat(form.priceFrom) : undefined,
        priceTo: form.priceTo ? parseFloat(form.priceTo) : undefined,
        ageFrom: form.ageFrom ? parseInt(form.ageFrom) : undefined,
        ageTo: form.ageTo ? parseInt(form.ageTo) : undefined,
        scheduleInfo: form.scheduleInfo || undefined,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setServices((prev) => [...prev, data.data]);
      setShowForm(false);
      setForm({ nameRu: '', descriptionRu: '', priceFrom: '', priceTo: '', ageFrom: '', ageTo: '', scheduleInfo: '' });
      setMessage('Услуга добавлена');
    } else {
      setMessage(data.error || 'Ошибка');
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/services/${id}`, { method: 'DELETE', credentials: 'include' });
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Загрузка...</div>;

  if (orgs.length === 0) {
    return (
      <div className="text-center py-20 bg-white border border-gray-200 rounded-xl">
        <p className="text-gray-600">Сначала создайте организацию в разделе «Профиль»</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Услуги</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>+ Добавить услугу</Button>
      </div>

      {orgs.length > 1 && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Организация</label>
          <select
            className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 max-w-sm"
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
          >
            {orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>
      )}

      {message && <p className="text-sm text-green-600">{message}</p>}

      {showForm && (
        <div className="bg-white border border-primary-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Новая услуга</h2>
          <div className="space-y-4">
            <Input label="Название *" value={form.nameRu} onChange={(e) => setForm({ ...form, nameRu: e.target.value })} required />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Описание</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                value={form.descriptionRu}
                onChange={(e) => setForm({ ...form, descriptionRu: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Цена от (₽)" type="number" value={form.priceFrom} onChange={(e) => setForm({ ...form, priceFrom: e.target.value })} />
              <Input label="Цена до (₽)" type="number" value={form.priceTo} onChange={(e) => setForm({ ...form, priceTo: e.target.value })} />
              <Input label="Возраст от" type="number" value={form.ageFrom} onChange={(e) => setForm({ ...form, ageFrom: e.target.value })} />
              <Input label="Возраст до" type="number" value={form.ageTo} onChange={(e) => setForm({ ...form, ageTo: e.target.value })} />
            </div>
            <Input label="Расписание" value={form.scheduleInfo} onChange={(e) => setForm({ ...form, scheduleInfo: e.target.value })} placeholder="Пн, Ср, Пт — 15:00–16:30" />
            <div className="flex gap-3">
              <Button onClick={handleCreate} loading={saving}>Добавить</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Отмена</Button>
            </div>
          </div>
        </div>
      )}

      {services.length > 0 ? (
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{service.nameRu}</h3>
                {service.descriptionRu && <p className="text-sm text-gray-600 mt-1">{service.descriptionRu}</p>}
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                  {(service.ageFrom || service.ageTo) && <span>Возраст: {service.ageFrom}–{service.ageTo} лет</span>}
                  {service.priceFrom && <span>от {service.priceFrom.toLocaleString('ru-RU')} ₽</span>}
                  {service.scheduleInfo && <span>{service.scheduleInfo}</span>}
                </div>
              </div>
              <button
                onClick={() => handleDelete(service.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium flex-shrink-0"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
          <div className="text-4xl mb-3">📚</div>
          <p className="text-gray-500">Услуги не добавлены. Добавьте первую услугу!</p>
        </div>
      )}
    </div>
  );
}
