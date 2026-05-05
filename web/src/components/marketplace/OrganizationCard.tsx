import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { useTranslations } from 'next-intl';

interface Organization {
  id: string;
  name: string;
  description?: string | null;
  type: string;
  city?: string | null;
  logoUrl?: string | null;
  isVerified: boolean;
  avgRating?: number | null;
  reviewCount?: number;
  services?: Array<{ priceFrom?: number | null; priceTo?: number | null }>;
  _count?: { services: number };
}

const TYPE_LABELS: Record<string, string> = {
  school: 'Школа',
  kindergarten: 'Детский сад',
  center: 'Центр развития',
  sports_club: 'Спортивная секция',
  music: 'Музыка',
  art: 'Художественная школа',
  language: 'Языковой центр',
  tutoring: 'Репетиторство',
  other: 'Другое',
};

const TYPE_COLORS: Record<string, 'blue' | 'green' | 'orange' | 'gray' | 'yellow'> = {
  school: 'blue',
  kindergarten: 'green',
  center: 'orange',
  sports_club: 'orange',
  music: 'yellow',
  art: 'yellow',
  language: 'blue',
  tutoring: 'gray',
  other: 'gray',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function OrganizationCard({ org, locale = 'ru' }: { org: Organization; locale?: string }) {
  const t = useTranslations('categories');
  const minPrice = org.services?.[0]?.priceFrom;

  return (
    <Link href={`/${locale}/organizations/${org.id}`} className="group block bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="w-14 h-14 flex-shrink-0 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center overflow-hidden">
            {org.logoUrl ? (
              <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-primary-400">{org.name.charAt(0)}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors text-base leading-tight truncate">
                {org.name}
              </h3>
              {org.isVerified && (
                <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <Badge variant={TYPE_COLORS[org.type] || 'gray'}>
                {TYPE_LABELS[org.type] || org.type}
              </Badge>
              {org.city && <span className="text-xs text-gray-500">{org.city}</span>}
            </div>
          </div>
        </div>

        {org.description && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">{org.description}</p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {org.avgRating ? (
              <div className="flex items-center gap-1.5">
                <StarRating rating={org.avgRating} />
                <span className="text-sm font-medium text-gray-700">{org.avgRating}</span>
                <span className="text-xs text-gray-400">({org.reviewCount})</span>
              </div>
            ) : (
              <span className="text-xs text-gray-400">Нет оценок</span>
            )}
          </div>
          {minPrice && (
            <span className="text-sm font-semibold text-gray-800">
              от {minPrice.toLocaleString('ru-RU')} ₽
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
