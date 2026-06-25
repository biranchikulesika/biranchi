import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Postcards",
  description: "Travel notes and spontaneous field dispatches.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
