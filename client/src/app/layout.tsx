import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono } from 'next/font/google';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { MotionProvider } from '@/components/site/MotionProvider';
import { COMPANY } from '@/lib/content';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

// Must be a domain this site is actually served from: link previews (Messenger, Facebook,
// iMessage) follow og:url / canonical and open that address. Set NEXT_PUBLIC_SITE_URL
// once a custom domain is attached in Vercel.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cargoflowgroup.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'CargoFlow | Aviation Parts, Freight Forwarding & Business Shipping — Miami',
    template: '%s | CargoFlow',
  },
  description:
    'CargoFlow is a Miami-based logistics partner specializing in aviation parts transportation, freight forwarding, and small-to-medium business shipping — from North Miami, Florida to destinations across the United States.',
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: 'CargoFlow',
    title: 'CargoFlow | Precision Logistics from Miami, Nationwide',
    description:
      'Reliable aviation parts transport, freight forwarding, and business shipping from Miami to destinations across the United States.',
    // Facebook/Messenger don't render SVG previews, so serve a PNG.
    images: [{ url: '/og-cover.png', width: 1200, height: 630, alt: 'CargoFlow — Precision logistics. Delivered without compromise.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CargoFlow | Precision Logistics from Miami, Nationwide',
    description: 'Aviation parts, freight forwarding, and business shipping. Local Miami expertise. National reach.',
    images: ['/og-cover.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#f2f0e9',
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MovingCompany',
  name: COMPANY.legalName,
  description: 'Aviation parts transportation, freight forwarding, and business shipping logistics.',
  email: COMPANY.email,
  areaServed: 'United States',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'North Miami',
    addressRegion: 'FL',
    addressCountry: 'US',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: browser extensions inject attributes on <html> (e.g. `webcrx`)
    // before hydration. Applies to this element's attributes only, not its children.
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <MotionProvider>
          <a
            href="#main"
            className="sign sign-direction fixed left-4 top-4 z-[100] -translate-y-24 text-sm focus:translate-y-0"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </MotionProvider>
        {/* Scroll reveals server-render at opacity 0; without JS they'd never appear. */}
        <noscript>
          <style>{'[style*="opacity:0"]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
