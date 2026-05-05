'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Profile {
  bio: string | null;
  specializations: string[];
  experienceYears: number | null;
  city: string | null;
}

export default function EducatorProfilePage() {
  const [profile, setProfile] = useState<Profile>({ bio: '', specializations: [], experienceYears: null, city: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [specInput, setSpecInput] = useState('');

  useEffect(() => {
    fetch('/api/educators/my/profile', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) setProfile(d.data);
        setLoading(false);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/educators/my/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        bio: profile.bio,
        specializations: profile.specializations,
        experienceYears: profile.experienceYears ? Number(profile.experienceYears) : undefined,
        city: profile.city,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  function addSpec() {
    const val = specInput.trim();
    if (val && !profile.specializations.includes(val)) {
      setProfile((p) => ({ ...p, specializations: [...p.specializations, val] }));
    }
    setSpecInput('');
  }

  function removeSpec(spec: string) {
    setProfile((p) => ({ ...p, specializations: p.specializations.filter((s) => s !== spec) }));
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Загрузка...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Мой профиль</h1>
        {saved && <span className="text-sm text-green-600 font-medium">Сохранено ✓</span>}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">Основная информация</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Город"
            placeholder="Москва"
            value={profile.city || ''}
            onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
          />
          <Input
            label="Лет опыта"
            type="number"
            placeholder="10"
            value={profile.experienceYears?.toString() || ''}
            onChange={(e) => setProfile((p) => ({ ...p, experienceYears: e.target.value ? Number(e.target.value) : null }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Биография и методология
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Расскажите о своём опыте, подходе к обучению и методике работы с детьми. Это первое, что видят родители.
          </p>
          <textarea
            rows={8}
            value={profile.bio || ''}
            onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
            placeholder="Я преподаю математику уже 10 лет. В своей работе использую методику проблемного обучения..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Специализации</h2>
        <p className="text-xs text-gray-500 mb-3">
          Добавьте предметы и направления, по которым вы работаете. Родители фильтруют педагогов по этим тегам.
        </p>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={specInput}
            onChange={(e) => setSpecInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSpec(); } }}
            placeholder="Математика, ЕГЭ, английский..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button type="button" variant="ghost" onClick={addSpec}>Добавить</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile.specializations.map((spec) => (
            <span key={spec} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
              {spec}
              <button type="button" onClick={() => removeSpec(spec)} className="text-blue-400 hover:text-blue-700">×</button>
            </span>
          ))}
          {profile.specializations.length === 0 && (
            <span className="text-sm text-gray-400">Нет специализаций — добавьте выше</span>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={saving}>Сохранить профиль</Button>
      </div>
    </form>
  );
}
