import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Essays",
  description: "Deep dives, philosophies, and analytical essays by Biranchi Kulesika.",
  openGraph: {
    title: "Essays — Inside The Head",
    description: "Deep dives, philosophies, and analytical essays by Biranchi Kulesika.",
    images: ['/images/og-fallback-thinker.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
