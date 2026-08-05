'use client';

import dynamic from 'next/dynamic';

// Dynamic import to disable SSR for the Desktop shell (uses window, document, drag)
const Desktop = dynamic(
  () => import('@/components/desktop/Desktop').then((mod) => mod.Desktop),
  { ssr: false }
);

export default function Home() {
  return <Desktop />;
}
