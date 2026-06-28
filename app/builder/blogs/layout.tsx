import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blogs",
  description: "Read the latest essays, thoughts, and technical writing from the Builder persona.",
  openGraph: {
    title: "Blogs — Forge Workspace",
    description: "Read the latest essays, thoughts, and technical writing from the Builder persona.",
    images: ['/images/og-fallback-builder.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
