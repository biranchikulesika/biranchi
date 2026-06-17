import type {Metadata} from 'next';
import { Inter, JetBrains_Mono, Playfair_Display, Cormorant_Garamond, Spectral } from 'next/font/google';
import './globals.css'; // Global styles
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@vercel/analytics/next';

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
  title: 'Biranchi',
  description: 'Systems, stories, and thoughts from the evolving world of Biranchi.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} ${spectral.variable}`}>
      <body className="font-sans antialiased dark:bg-black dark:text-white dark:selection:bg-white/20 bg-white text-black selection:bg-black/20">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}


