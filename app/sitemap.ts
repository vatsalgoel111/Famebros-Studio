import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // SET real domain before launch via NEXT_PUBLIC_SITE_URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];
}
