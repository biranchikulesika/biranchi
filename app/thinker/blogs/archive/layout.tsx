import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Archive",
  description: "Past essays and philosophical records.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
