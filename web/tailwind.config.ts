import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f3ff',
          100: '#d1e7ff',
          200: '#a6cfff',
          500: '#1a73e8',
          600: '#1565c0',
          700: '#0d47a1',
          800: '#0a3a82',
          DEFAULT: '#1565c0',
        },
        accent: {
          500: '#f06400',
          600: '#d45800',
          DEFAULT: '#f06400',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
