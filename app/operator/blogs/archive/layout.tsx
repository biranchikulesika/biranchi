import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Archive",
  description: "Historical operations and archived security logs.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
