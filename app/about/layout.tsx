import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About",
  description: "A personal ecosystem shaped by curiosity, systems, stories, and reflection. Learn more about Biranchi and the four personas.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
