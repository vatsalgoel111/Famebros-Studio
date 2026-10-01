'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/data/site';
import Container from './Container';

export default function Footer() {
  const instagramUrl = `https://instagram.com/${siteConfig.instagram.replace(/^@/, '')}`;

  return (
    <footer
      id="footer"
      className="w-full border-t border-line-on-dark bg-ink text-paper pt-5 sm:pt-6 pb-[calc(1.25rem+4.5rem+env(safe-area-inset-bottom,0px))] md:py-6"
    >
      <Container>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-3 sm:gap-6">
            <Link
              href="/"
              className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-paper hover:opacity-85 select-none"
            >
              FAMEBROS
            </Link>
            <span className="font-mono text-xs text-paper/60 uppercase tracking-wider">
              {siteConfig.city}, India &bull; Every feed run in-house
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-paper hover:text-paper/70 transition-colors"
            >
              <span>{siteConfig.instagram}</span>
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-paper hover:text-paper/70 transition-colors"
            >
              {siteConfig.email}
            </a>
            <span className="text-paper/40">
              &copy; {new Date().getFullYear()} {siteConfig.name}
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
