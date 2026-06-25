import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dispatch",
  description: "Updates on operational security and technical insights.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
