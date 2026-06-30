import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Log in to Biranchi CMS to access your digital garden and manage your content.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
