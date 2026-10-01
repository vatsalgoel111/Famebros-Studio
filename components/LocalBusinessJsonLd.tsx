import React from 'react';
import { siteConfig } from '@/data/site';

/**
 * Server component generating safe Schema.org LocalBusiness JSON-LD structured data.
 * Escapes '<' characters to prevent script tag injection vulnerabilities.
 */
export default function LocalBusinessJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const instagramUrl = `https://instagram.com/${siteConfig.instagram.replace(/^@/, '')}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.name,
    url: siteUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.city || 'Mumbai',
      addressCountry: 'IN',
    },
    sameAs: [instagramUrl],
    areaServed: siteConfig.city || 'Mumbai',
  };

  // Safe JSON-LD embedding: escape '<' to prevent XSS or premature </script> tag closure
  const safeJsonString = JSON.stringify(jsonLd).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonString }}
    />
  );
}
