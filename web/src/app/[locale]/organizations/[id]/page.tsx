import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { serverFetch } from '@/lib/api';
import LeadForm from '@/components/marketplace/LeadForm';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

const TYPE_LABELS: Record<string, string> = {
  school: 'Школа', kindergarten: 'Детский сад', center: 'Центр развития',
  sports_club: 'Спортивная секция', music: 'Музыка', art: 'Художественная школа',
  language: 'Языковой центр', tutoring: 'Репетиторство', other: 'Другое',
};

interface Review {
  id: string;
  rating: number;
  body?: string | null;
  createdAt: string;
  author: { name: string };
}

interface Service {
  id: string;
  nameRu: string;
  descriptionRu?: string | null;
  priceFrom?: number | null;
  priceTo?: number | null;
  ageFrom?: number | null;
  ageTo?: number | null;
  scheduleInfo?: string | null;
}

interface Organization {
  id: string;
  name: string;
  description?: string | null;
  type: string;
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  isVerified: boolean;
  services: Service[];
  reviews: Review[];
  avgRating?: number | null;
  reviewCount: number;
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sz = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`${sz} ${s <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default async function OrganizationPage({ params }: { params: { id: string; locale: string } }) {
  const t = await getTranslations('org');
  const result = await serverFetch<Organization>(`/api/organizations/${params.id}`);
  if (!result.success || !result.data) notFound();

  const org = result.data;
  const locale = params.locale;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href={`/${locale}/search`} className="text-sm text-primary-600 hover:text-primary-700 mb-6 inline-flex items-center gap-1">
        ← Назад к поиску
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 flex-shrink-0 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center overflow-hidden">
                {org.logoUrl ? (
                  <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-primary-400">{org.name.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900">{org.name}</h1>
                  {org.isVerified && (
                    <Badge variant="green">{t('verified')}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="blue">{TYPE_LABELS[org.type] || org.type}</Badge>
                  {org.city && <span className="text-sm text-gray-500">{org.city}</span>}
                </div>
                {org.avgRating && (
                  <div className="flex items-center gap-2 mt-3">
                    <StarRating rating={org.avgRating} size="lg" />
                    <span className="text-lg font-semibold text-gray-900">{org.avgRating}</span>
                    <span className="text-sm text-gray-500">({org.reviewCount} {t('reviews')})</span>
                  </div>
                )}
              </div>
            </div>
            {org.description && (
              <p className="mt-5 text-gray-700 leading-relaxed">{org.description}</p>
            )}
          </div>

          {/* Services */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('services')}</h2>
            {org.services.length > 0 ? (
              <div className="space-y-4">
                {org.services.map((service) => (
                  <div key={service.id} className="border border-gray-100 rounded-lg p-4 hover:border-primary-200 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{service.nameRu}</h3>
                        {service.descriptionRu && (
                          <p className="text-sm text-gray-600 mt-1">{service.descriptionRu}</p>
                        )}
                        <div className="flex flex-wrap gap-3 mt-2">
                          {(service.ageFrom || service.ageTo) && (
                            <span className="text-xs text-gray-500">
                              {t('age')}: {service.ageFrom}–{service.ageTo} {t('years')}
                            </span>
                          )}
                          {service.scheduleInfo && (
                            <span className="text-xs text-gray-500">{service.scheduleInfo}</span>
                          )}
                        </div>
                      </div>
                      {(service.priceFrom || service.priceTo) && (
                        <div className="text-right flex-shrink-0">
                          <span className="text-sm font-semibold text-gray-900">
                            {service.priceFrom ? `${t('from')} ${service.priceFrom.toLocaleString('ru-RU')} ₽` : ''}
                            {service.priceTo ? ` — ${service.priceTo.toLocaleString('ru-RU')} ₽` : ''}
                          </span>
                          <div className="text-xs text-gray-400">{t('per_month')}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">{t('no_services')}</p>
            )}
          </div>

          {/* Reviews */}
          {org.reviews.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Отзывы</h2>
              <div className="space-y-5">
                {org.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">
                          {review.author.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{review.author.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} />
                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>
                    {review.body && <p className="text-sm text-gray-700 ml-11">{review.body}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Lead form */}
          <LeadForm
            organizationId={org.id}
            services={org.services.map((s) => ({ id: s.id, nameRu: s.nameRu }))}
          />

          {/* Contact info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-4">{t('contact')}</h3>
            <div className="space-y-3">
              {org.address && (
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm text-gray-700">{org.address}</span>
                </div>
              )}
              {org.phone && (
                <a href={`tel:${org.phone}`} className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {org.phone}
                </a>
              )}
              {org.email && (
                <a href={`mailto:${org.email}`} className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {org.email}
                </a>
              )}
              {org.website && (
                <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Сайт организации
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
