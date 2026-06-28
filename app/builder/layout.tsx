import { Metadata } from 'next';
import { ThemeToggle } from '@/components/theme-toggle';
import { PersonaSwitcher } from '@/components/persona-switcher';
import { PersonaSearch } from '@/components/persona-search';
import { DesktopNav, MobileNav } from '@/components/nav-links';
import { FooterBuilder } from '@/components/footer-builder';
import { SITE_NAME, AUTHOR, getCanonicalUrl } from '@/lib/config/seo';

export const metadata: Metadata = {
  title: {
    default: "Forge Workspace",
    template: "%s | Forge Workspace"
  },
  description: "Systems, Code, Open Source — the Builder persona of Biranchi Kulesika.",
  openGraph: {
    siteName: SITE_NAME,
    description: "Systems, Code, Open Source — the Builder persona of Biranchi Kulesika.",
    images: ['/images/og-fallback-builder.png'],
  },
  twitter: {
    card: 'summary_large_image',
    creator: AUTHOR.twitter,
  },
  alternates: {
    canonical: getCanonicalUrl('/builder'),
  },
};

import { JetBrains_Mono } from 'next/font/google';

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${mono.variable} font-persona theme-builder bg-background text-foreground min-h-screen selection:bg-primary/20 flex flex-col`}>
      <header className="sticky top-0 z-50 w-full p-4 md:p-6 flex justify-between items-center border-b border-border bg-background/80 backdrop-blur-md">
        <PersonaSwitcher currentPersona="Builder" currentStyle="text-primary font-mono" />
        <div className="flex items-center gap-1 md:gap-2">
          <DesktopNav persona="builder" />
          <PersonaSearch persona="Builder" mobileBgColor="bg-background" />
          <ThemeToggle />
          <MobileNav persona="builder" mobileBgColor="bg-background" />
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <FooterBuilder />
    </div>
  );
}
