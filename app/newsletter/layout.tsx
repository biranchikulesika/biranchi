import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Subscribe to Biranchi's newsletter for the latest stories, experimental systems, thoughts, and reflections across the four personas.",
};

export default function NewsletterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
