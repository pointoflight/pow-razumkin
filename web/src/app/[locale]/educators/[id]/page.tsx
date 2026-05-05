import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/api';
import LeadForm from '@/components/marketplace/LeadForm';
import Link from 'next/link';

interface DemoService { name: string; priceFrom: number; priceTo: number; duration: string; format: string }
interface DemoPost { title: string; body: string; type: 'article' | 'tip'; createdAt: string }

interface Educator {
  id: string;
  bio?: string | null;
  specializations: string[];
  experienceYears?: number | null;
  photoUrl?: string | null;
  city?: string | null;
  avgRating?: number | null;
  reviewCount: number;
  user: { name: string; phone?: string | null; email: string };
  reviews: Array<{ id: string; rating: number; body?: string | null; createdAt: string; author: { name: string } }>;
  demoServices?: DemoService[];
  demoPosts?: DemoPost[];
}

const TYPE_LABELS: Record<string, string> = { article: 'Статья', tip: 'Совет', video: 'Видео' };
const TYPE_COLORS: Record<string, string> = {
  article: 'bg-purple-50 text-purple-700',
  tip: 'bg-green-50 text-green-700',
  video: 'bg-red-50 text-red-700',
};

function formatPrice(from: number, to: number) {
  if (from === 0 && to === 0) return 'Бесплатно';
  if (from === to) return `${from.toLocaleString('ru-RU')} ₽`;
  return `${from.toLocaleString('ru-RU')} — ${to.toLocaleString('ru-RU')} ₽`;
}

export default async function EducatorPage({ params }: { params: { id: string; locale: string } }) {
  const result = await serverFetch<Educator>(`/api/educators/${params.id}`);
  if (!result.success || !result.data) notFound();
  const educator = result.data;
  const locale = params.locale;
  const services = educator.demoServices ?? [];
  const posts = educator.demoPosts ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href={`/${locale}/educators`} className="text-sm text-primary-600 hover:text-primary-700 mb-6 inline-flex items-center gap-1">
        ← Все педагоги
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 flex-shrink-0 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-3xl font-bold">
                {educator.user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{educator.user.name}</h1>
                {educator.city && <p className="text-gray-500 mt-1">{educator.city}</p>}
                {educator.experienceYears && (
                  <p className="text-sm text-gray-600 mt-1">Опыт: {educator.experienceYears} {educator.experienceYears >= 5 ? 'лет' : educator.experienceYears >= 2 ? 'года' : 'год'}</p>
                )}
                {educator.avgRating && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="font-semibold text-gray-900">{educator.avgRating}</span>
                    <span className="text-gray-500 text-sm">({educator.reviewCount} {educator.reviewCount === 1 ? 'отзыв' : educator.reviewCount < 5 ? 'отзыва' : 'отзывов'})</span>
                  </div>
                )}
              </div>
            </div>
            {educator.bio && (
              <p className="mt-5 text-gray-700 leading-relaxed whitespace-pre-line">{educator.bio}</p>
            )}
            {educator.specializations.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {educator.specializations.map((spec) => (
                  <span key={spec} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">{spec}</span>
                ))}
              </div>
            )}
          </div>

          {/* Services */}
          {services.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Услуги и цены</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((svc, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4 hover:border-primary-200 transition-colors">
                    <h3 className="font-medium text-gray-900 text-sm mb-2 leading-snug">{svc.name}</h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">⏱ {svc.duration}</span>
                      <span className="flex items-center gap-1">📍 {svc.format}</span>
                    </div>
                    <div className={`text-base font-bold ${svc.priceFrom === 0 && svc.priceTo === 0 ? 'text-green-600' : 'text-primary-600'}`}>
                      {formatPrice(svc.priceFrom, svc.priceTo)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Publications */}
          {posts.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Публикации педагога</h2>
              <div className="space-y-4">
                {posts.map((post, i) => (
                  <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[post.type] ?? 'bg-gray-100 text-gray-600'}`}>
                        {TYPE_LABELS[post.type] ?? post.type}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{post.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{post.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {educator.reviews.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Отзывы</h2>
              <div className="space-y-4">
                {educator.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 text-sm">{review.author.name}</span>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((s) => (
                          <span key={s} className={`text-sm ${s <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                        ))}
                      </div>
                    </div>
                    {review.body && <p className="text-sm text-gray-700">{review.body}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <LeadForm educatorId={educator.id} />
          {(educator.user.phone || educator.user.email) && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Контакты</h3>
              {educator.user.phone && (
                <a href={`tel:${educator.user.phone}`} className="flex items-center gap-2 text-sm text-primary-600 mb-2">
                  📞 {educator.user.phone}
                </a>
              )}
              {educator.user.email && (
                <a href={`mailto:${educator.user.email}`} className="flex items-center gap-2 text-sm text-primary-600">
                  ✉️ {educator.user.email}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
