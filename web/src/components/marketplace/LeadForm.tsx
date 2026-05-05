'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Service {
  id: string;
  nameRu: string;
}

interface Child {
  id: string;
  name: string;
}

interface Props {
  organizationId?: string;
  educatorId?: string;
  services?: Service[];
  children?: Child[];
}

export default function LeadForm({ organizationId, educatorId, services = [], children = [] }: Props) {
  const t = useTranslations('lead');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    parentName: '',
    parentPhone: '',
    serviceId: '',
    childId: '',
    message: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...(organizationId ? { organizationId } : {}),
          ...(educatorId ? { educatorId } : {}),
          parentName: form.parentName,
          parentPhone: form.parentPhone,
          ...(form.serviceId ? { serviceId: form.serviceId } : {}),
          ...(form.childId ? { childId: form.childId } : {}),
          ...(form.message ? { message: form.message } : {}),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || t('error'));
      }
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-green-800 font-medium">{t('success')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{t('title')}</h3>
      <p className="text-sm text-gray-500 mb-5">{t('subtitle')}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('your_name')}
          placeholder="Анна Иванова"
          value={form.parentName}
          onChange={(e) => setForm({ ...form, parentName: e.target.value })}
          required
        />
        <Input
          label={t('your_phone')}
          type="tel"
          placeholder="+7 900 000-00-00"
          value={form.parentPhone}
          onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
          required
        />

        {services.length > 0 && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{t('service')}</label>
            <select
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={form.serviceId}
              onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
            >
              <option value="">{t('select_service')}</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.nameRu}</option>
              ))}
            </select>
          </div>
        )}

        {children.length > 0 && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{t('your_child')}</label>
            <select
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={form.childId}
              onChange={(e) => setForm({ ...form, childId: e.target.value })}
            >
              <option value="">{t('select_child')}</option>
              {children.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{t('message')}</label>
          <textarea
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows={3}
            placeholder={t('message_placeholder')}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" loading={loading} size="lg" variant="accent" className="w-full">
          {t('submit')}
        </Button>
      </form>
    </div>
  );
}
