'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';

interface Service {
  id: string;
  name: string;
  description: string;
  priceFrom: number;
  priceTo: number;
  duration: string;
  format: string;
}

const STORAGE_KEY = 'educator_services';

const SAMPLE_SERVICES: Service[] = [
  {
    id: 'svc-1',
    name: 'Индивидуальный урок (60 мин)',
    description: 'Персональное занятие, полностью адаптированное под вашего ребёнка. Разбираем темы, которые вызывают трудности. Подходит для подготовки к контрольным и экзаменам.',
    priceFrom: 2500,
    priceTo: 3000,
    duration: '60 мин',
    format: 'Онлайн / Очно',
  },
  {
    id: 'svc-2',
    name: 'Подготовка к ОГЭ (курс)',
    description: 'Систематическая подготовка к ОГЭ по математике. 24 занятия, разбор всех тем из кодификатора, тренировочные варианты, разбор ошибок.',
    priceFrom: 28000,
    priceTo: 35000,
    duration: '3 месяца',
    format: 'Онлайн',
  },
  {
    id: 'svc-3',
    name: 'Подготовка к ЕГЭ (курс)',
    description: 'Полный курс подготовки к ЕГЭ по математике (профиль). От базы до сложных заданий части 2. Индивидуальный темп, постоянная обратная связь.',
    priceFrom: 45000,
    priceTo: 60000,
    duration: '6 месяцев',
    format: 'Онлайн',
  },
  {
    id: 'svc-4',
    name: 'Консультация (30 мин)',
    description: 'Быстрая помощь с конкретным заданием или темой. Идеально для разовых вопросов перед контрольной работой.',
    priceFrom: 1200,
    priceTo: 1500,
    duration: '30 мин',
    format: 'Онлайн',
  },
];

export default function EducatorServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Service, 'id'>>({
    name: '', description: '', priceFrom: 0, priceTo: 0, duration: '', format: 'Онлайн',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const stored: Service[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setServices([...SAMPLE_SERVICES, ...stored]);
    } catch {
      setServices(SAMPLE_SERVICES);
    }
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    setTimeout(() => {
      const newService: Service = { id: `svc-${Date.now()}`, ...form };
      const stored: Service[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      stored.push(newService);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      setServices([...services, newService]);
      setForm({ name: '', description: '', priceFrom: 0, priceTo: 0, duration: '', format: 'Онлайн' });
      setShowForm(false);
      setSaving(false);
    }, 500);
  }

  function deleteService(id: string) {
    if (id.startsWith('svc-') && Number(id.split('-')[1]) < 10) return;
    const stored: Service[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = stored.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setServices(services.filter((s) => s.id !== id));
  }

  function formatPrice(from: number, to: number) {
    if (from === to) return `${from.toLocaleString('ru-RU')} ₽`;
    return `${from.toLocaleString('ru-RU')} — ${to.toLocaleString('ru-RU')} ₽`;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Мои услуги</h1>
          <p className="text-sm text-gray-500 mt-0.5">Платные консультации, курсы и занятия</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Отмена' : '+ Добавить услугу'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white border border-primary-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Новая услуга</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Индивидуальный урок"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Что входит в услугу, для кого она подходит..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Цена от (₽)</label>
              <input
                type="number"
                value={form.priceFrom}
                onChange={(e) => setForm((f) => ({ ...f, priceFrom: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Цена до (₽)</label>
              <input
                type="number"
                value={form.priceTo}
                onChange={(e) => setForm((f) => ({ ...f, priceTo: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Длительность</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                placeholder="60 мин / 3 месяца"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Формат</label>
              <select
                value={form.format}
                onChange={(e) => setForm((f) => ({ ...f, format: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option>Онлайн</option>
                <option>Очно</option>
                <option>Онлайн / Очно</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Отмена</Button>
            <Button type="submit" loading={saving}>Сохранить</Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {services.map((service) => (
          <div key={service.id} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                {service.description && (
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{service.description}</p>
                )}
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <span>⏱</span> {service.duration}
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <span>📍</span> {service.format}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-bold text-primary-600">
                  {formatPrice(service.priceFrom, service.priceTo)}
                </div>
                {!service.id.startsWith('svc-') || Number(service.id.split('-')[1]) >= 10 ? (
                  <button
                    onClick={() => deleteService(service.id)}
                    className="text-xs text-red-400 hover:text-red-600 mt-1"
                  >
                    Удалить
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
