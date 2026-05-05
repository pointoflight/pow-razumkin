import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EduMarket — образование для детей',
  description: 'Маркетплейс детского образования: детские сады, школы, центры развития, репетиторы',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
