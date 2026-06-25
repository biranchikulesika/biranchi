import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Logs",
  description: "Tactical logs and operational security notes.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
