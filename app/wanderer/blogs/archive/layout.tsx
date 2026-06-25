import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Wanderer Logs",
  description: "Archived field sketches and past journeys.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
