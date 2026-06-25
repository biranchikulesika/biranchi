import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about the Forge Workspace and the Builder persona.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
