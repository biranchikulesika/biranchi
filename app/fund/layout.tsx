import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Fund",
  description: "Support the community and view redistribution records. Learn how your patronage funds open research, operations, and creative artifacts.",
};

export default function FundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
