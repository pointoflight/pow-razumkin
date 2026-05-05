import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/api';
import LeadForm from '@/components/marketplace/LeadForm';
import Link from 'next/link';

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
}

export default async function EducatorPage({ params }: { params: { id: string; locale: string } }) {
  const result = await serverFetch<Educator>(`/api/educators/${params.id}`);
  if (!result.success || !result.data) notFound();
  const educator = result.data;
  const locale = params.locale;

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
                  <p className="text-sm text-gray-600 mt-1">Опыт: {educator.experienceYears} лет</p>
                )}
                {educator.avgRating && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="font-semibold text-gray-900">{educator.avgRating}</span>
                    <span className="text-gray-500 text-sm">({educator.reviewCount} отзывов)</span>
                  </div>
                )}
              </div>
            </div>
            {educator.bio && (
              <p className="mt-5 text-gray-700 leading-relaxed">{educator.bio}</p>
            )}
            {educator.specializations.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {educator.specializations.map((spec) => (
                  <span key={spec} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">{spec}</span>
                ))}
              </div>
            )}
          </div>

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
