import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Essays",
  description: "Deep dives, philosophies, and analytical essays.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
