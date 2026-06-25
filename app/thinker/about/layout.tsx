import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about the Thinker persona.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
