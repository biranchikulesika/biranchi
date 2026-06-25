import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blogs",
  description: "Read the latest essays, thoughts, and technical writing from the Builder persona.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
