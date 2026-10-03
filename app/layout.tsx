import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Inter } from 'next/font/google';
import './globals.css';
import { SHOW_CONTENT_STATUS, siteConfig } from '@/data/site';
import ContentStatus from '@/components/ContentStatus';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

// SET real domain before launch
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Famebros Studio — Mumbai creative studio',
    template: '%s | Famebros Studio',
  },
  description:
    'Famebros Studio runs the Instagram presence of creators and brands in Mumbai — shoots, edits, and social management.',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: siteConfig.name,
    title: 'Famebros Studio — Mumbai creative studio',
    description:
      'Famebros Studio runs the Instagram presence of creators and brands in Mumbai — shoots, edits, and social management.',
    url: siteUrl,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Famebros Studio — Mumbai creative studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Famebros Studio — Mumbai creative studio',
    description:
      'Famebros Studio runs the Instagram presence of creators and brands in Mumbai — shoots, edits, and social management.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [{ url: '/icon.png' }],
  },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`js ${bricolage.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-paper text-ink font-body selection:bg-signal selection:text-ink"
        suppressHydrationWarning
      >
        {children}
        {SHOW_CONTENT_STATUS && <ContentStatus />}
      </body>
    </html>
  );
}
