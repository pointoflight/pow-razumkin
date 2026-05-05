'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';

interface Post {
  id: string;
  title: string;
  body: string;
  type: 'article' | 'tip' | 'video';
  createdAt: string;
  published: boolean;
}

const SAMPLE_POSTS: Post[] = [
  {
    id: 'demo-1',
    title: 'Как помочь ребёнку полюбить математику',
    body: 'Многие дети боятся математики — и это не их вина. Главная ошибка взрослых: ругать за ошибки вместо того, чтобы объяснять. В этой статье я делюсь проверенными приёмами, которые превращают страх в интерес. Начинаем с игры: загадки, пазлы, счёт в магазине. Мозг ребёнка обучается через удовольствие, а не через стресс.',
    type: 'article',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    published: true,
  },
  {
    id: 'demo-2',
    title: '5 ошибок при подготовке к ЕГЭ по математике',
    body: 'Ошибка 1: начинать поздно. Ошибка 2: решать только лёгкие задания. Ошибка 3: игнорировать разбор ошибок. Ошибка 4: зубрить формулы без понимания. Ошибка 5: не тренировать тайм-менеджмент. Каждый пункт разбираю подробно с примерами из практики.',
    type: 'article',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    published: true,
  },
  {
    id: 'demo-3',
    title: 'Совет: правило 20 минут для домашнего задания',
    body: 'Если ребёнок не может решить задачу за 20 минут — это не его проблема, это сигнал о пробеле в знаниях. Не сидите рядом и не подсказывайте. Лучше запишите задачу и покажите репетитору: именно такие «застрявшие» задачи — самые ценные для работы.',
    type: 'tip',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    published: true,
  },
];

const TYPE_LABELS: Record<string, string> = { article: 'Статья', tip: 'Совет', video: 'Видео' };
const TYPE_COLORS: Record<string, string> = {
  article: 'bg-purple-50 text-purple-700',
  tip: 'bg-green-50 text-green-700',
  video: 'bg-red-50 text-red-700',
};

const STORAGE_KEY = 'educator_posts';

export default function EducatorContentPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', type: 'article' as Post['type'] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Post[];
      setPosts([...SAMPLE_POSTS, ...stored]);
    } catch {
      setPosts(SAMPLE_POSTS);
    }
  }, []);

  function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    setSaving(true);
    setTimeout(() => {
      const newPost: Post = {
        id: `post-${Date.now()}`,
        title: form.title,
        body: form.body,
        type: form.type,
        createdAt: new Date().toISOString(),
        published: true,
      };
      const stored: Post[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      stored.unshift(newPost);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      setPosts([newPost, ...posts]);
      setForm({ title: '', body: '', type: 'article' });
      setShowForm(false);
      setSaving(false);
    }, 600);
  }

  function deletePost(id: string) {
    if (id.startsWith('demo-')) return;
    const stored: Post[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = stored.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setPosts(posts.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Публикации</h1>
          <p className="text-sm text-gray-500 mt-0.5">Статьи, советы и рекомендации для родителей</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Отмена' : '+ Новая публикация'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handlePublish} className="bg-white border border-primary-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Новая публикация</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Тип</label>
            <div className="flex gap-2">
              {(['article', 'tip', 'video'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: t }))}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium border transition-colors ${form.type === t ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-600 hover:border-primary-300'}`}
                >
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Например: Как мотивировать ребёнка к учёбе"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Текст</label>
            <textarea
              required
              rows={6}
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              placeholder="Поделитесь вашим опытом и советами..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Отмена</Button>
            <Button type="submit" loading={saving}>Опубликовать</Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[post.type]}`}>
                  {TYPE_LABELS[post.type]}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                  Опубликовано
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                </span>
                {!post.id.startsWith('demo-') && (
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Удалить
                  </button>
                )}
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{post.body}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
        <h3 className="font-semibold text-blue-800 mb-1">Зачем публиковать контент?</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>Статьи и советы повышают доверие родителей к вам как эксперту</li>
          <li>Полезный контент привлекает новых учеников через поиск</li>
          <li>Регулярные публикации показывают вашу вовлечённость</li>
        </ul>
      </div>
    </div>
  );
}
