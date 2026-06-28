import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Inter, JetBrains_Mono, Playfair_Display, Cormorant_Garamond, Spectral } from 'next/font/google';
import './globals.css'; // Global styles
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@vercel/analytics/next';
import { SITE_URL, SITE_NAME, AUTHOR } from '@/lib/config/seo';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
});

const spectral = Spectral({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-spectral',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Biranchi',
    template: '%s | Biranchi',
  },
  description: 'Personal digital garden and portfolio of Biranchi Kulesika, featuring the Builder, Operator, Thinker, and Wanderer personas.',
  authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
  creator: AUTHOR.name,
  publisher: AUTHOR.name,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    url: SITE_URL,
    images: ['/images/og-main.png'],
  },
  twitter: {
    card: 'summary_large_image',
    creator: AUTHOR.twitter,
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/images/biranchi.png', type: 'image/png' },
    ],
    shortcut: ['/images/biranchi.png'],
    apple: [
      { url: '/images/biranchi.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get('theme');
  const serverTheme = themeCookie ? themeCookie.value : 'dark';

  return (
    <html lang="en" suppressHydrationWarning className={`${serverTheme} ${inter.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} ${spectral.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground selection:bg-primary/20">
        <ThemeProvider attribute="class" defaultTheme={serverTheme} enableSystem={false}>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}


