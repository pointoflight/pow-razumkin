import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: '89.167.58.170' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: 'api' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${process.env.INTERNAL_API_URL || 'http://api:3011'}/uploads/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
