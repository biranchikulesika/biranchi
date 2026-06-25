import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Letters",
  description: "Periodic letters exploring systems, philosophy, and mind.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
