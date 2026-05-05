'use client';

import { useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface Child {
  id: string;
  name: string;
  birthDate?: string | null;
  gender?: string | null;
  interests: string[];
}

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', birthDate: '', gender: '', interests: '' });
  const [saving, setSaving] = useState(false);

  function fetchChildren() {
    fetch('/api/children', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (d.success) setChildren(d.data); setLoading(false); });
  }

  useEffect(() => { fetchChildren(); }, []);

  async function handleAdd() {
    setSaving(true);
    const res = await fetch('/api/children', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: form.name,
        birthDate: form.birthDate || undefined,
        gender: form.gender || undefined,
        interests: form.interests ? form.interests.split(',').map((i) => i.trim()).filter(Boolean) : [],
      }),
    });
    const data = await res.json();
    if (data.success) {
      setChildren((prev) => [...prev, data.data]);
      setShowForm(false);
      setForm({ name: '', birthDate: '', gender: '', interests: '' });
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/children/${id}`, { method: 'DELETE', credentials: 'include' });
    setChildren((prev) => prev.filter((c) => c.id !== id));
  }

  function getAge(birthDate: string) {
    const age = Math.floor((Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    return `${age} лет`;
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Загрузка...</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Мои дети</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>+ Добавить ребёнка</Button>
      </div>

      {showForm && (
        <div className="bg-white border border-primary-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Новый ребёнок</h2>
          <div className="space-y-4">
            <Input label="Имя *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Иван" required />
            <Input label="Дата рождения" type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Пол</label>
              <div className="flex gap-4">
                {[{ value: 'male', label: '👦 Мальчик' }, { value: 'female', label: '👧 Девочка' }].map((g) => (
                  <label key={g.value} className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg cursor-pointer transition-all ${form.gender === g.value ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-600'}`}>
                    <input type="radio" name="gender" value={g.value} checked={form.gender === g.value} onChange={() => setForm({ ...form, gender: g.value })} className="sr-only" />
                    <span className="text-sm font-medium">{g.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <Input
              label="Интересы (через запятую)"
              value={form.interests}
              onChange={(e) => setForm({ ...form, interests: e.target.value })}
              placeholder="рисование, математика, футбол"
            />
            <div className="flex gap-3">
              <Button onClick={handleAdd} loading={saving}>Добавить</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Отмена</Button>
            </div>
          </div>
        </div>
      )}

      {children.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {children.map((child) => (
            <div key={child.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
                    {child.gender === 'male' ? '👦' : child.gender === 'female' ? '👧' : '🧒'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{child.name}</h3>
                    {child.birthDate && (
                      <p className="text-sm text-gray-500">{getAge(child.birthDate)}</p>
                    )}
                  </div>
                </div>
                <button onClick={() => handleDelete(child.id)} className="text-red-500 hover:text-red-700 text-sm">Удалить</button>
              </div>
              {child.interests.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {child.interests.map((interest) => (
                    <span key={interest} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">{interest}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-xl">
          <div className="text-5xl mb-4">👧</div>
          <p className="text-gray-500">Дети не добавлены</p>
        </div>
      )}
    </div>
  );
}
