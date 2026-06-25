import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Subscribe to the Forge Dispatch for the latest build logs.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
