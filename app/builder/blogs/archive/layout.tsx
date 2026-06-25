import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Archive",
  description: "Explore older build logs and technical essays.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
