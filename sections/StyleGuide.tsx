'use client';

import React, { useState } from 'react';
import Container from '@/components/Container';
import Section from '@/components/Section';
import SectionLabel from '@/components/SectionLabel';
import CreditPill from '@/components/CreditPill';
import Highlight from '@/components/Highlight';
import Button from '@/components/Button';
import Chip from '@/components/Chip';
import PlaceholderTile from '@/components/PlaceholderTile';
import Hairline from '@/components/Hairline';

export default function StyleGuide() {
  const [selectedIndustry, setSelectedIndustry] = useState('jewellery');

  const industries = ['jewellery', 'fashion', 'hospitality', 'retail', 'other'];

  const colorSwatches = [
    { name: 'paper', hex: '#F4F1EA', class: 'bg-paper text-ink border border-line', desc: 'Main canvas' },
    { name: 'ink', hex: '#0E0E0E', class: 'bg-ink text-paper', desc: 'Primary text & dark canvas' },
    { name: 'signal', hex: '#FFC400', class: 'bg-signal text-ink', desc: 'Accents & credit pills ONLY' },
    { name: 'ink-soft', hex: '#4A4741', class: 'bg-ink-soft text-paper', desc: 'Secondary text' },
    { name: 'paper-dark', hex: '#E9E4D9', class: 'bg-paper-dark text-ink', desc: 'Panels & subtle fills' },
    { name: 'line', hex: 'rgba(14,14,14,0.16)', class: 'bg-paper text-ink border-2 border-line', desc: 'Hairline borders' },
  ];

  return (
    <Section
      id="style-guide"
      ariaLabel="Design System Style Guide"
      className="border-b-4 border-ink bg-paper pt-8 pb-16"
    >
      <Container>
        {/* Style Guide Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-line">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-signal text-ink text-[11px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider">
                Dev Tool
              </span>
              <SectionLabel label="Temporary Style Guide" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Design System & Primitives
            </h2>
          </div>
          <p className="font-mono text-xs text-ink-soft max-w-xs">
            Visible because <code className="bg-paper-dark px-1 py-0.5">SHOW_STYLEGUIDE = true</code> in site.ts.
          </p>
        </div>

        <div className="mt-12 space-y-16">
          {/* 1. Color Palette */}
          <div>
            <SectionLabel label="01 / Color Tokens" />
            <h3 className="font-display text-xl font-bold mt-2 mb-6">Palette Discipline</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {colorSwatches.map((swatch) => (
                <div key={swatch.name} className="flex flex-col border border-line p-3">
                  <div className={`h-20 w-full mb-3 flex items-center justify-center font-mono text-xs font-bold ${swatch.class}`}>
                    {swatch.name}
                  </div>
                  <span className="font-mono text-xs font-semibold text-ink">{swatch.hex}</span>
                  <span className="font-body text-[11px] text-ink-soft mt-1">{swatch.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <Hairline />

          {/* 2. Typography Scale */}
          <div>
            <SectionLabel label="02 / Fluid Typography" />
            <h3 className="font-display text-xl font-bold mt-2 mb-6">Type Scale (Archivo & Inter)</h3>
            
            <div className="space-y-6 border border-line p-6 bg-paper-dark/20">
              <div>
                <span className="font-mono text-xs text-ink-soft block mb-1">display (clamp: 3rem - 8rem, weight 800, line-height 0.92)</span>
                <p className="text-display">You&apos;ve already seen our work.</p>
              </div>

              <Hairline />

              <div>
                <span className="font-mono text-xs text-ink-soft block mb-1">h1 (clamp: 2.5rem - 5rem, weight 700)</span>
                <p className="text-h1">The Feed Mosaic</p>
              </div>

              <Hairline />

              <div>
                <span className="font-mono text-xs text-ink-soft block mb-1">h2 (clamp: 1.75rem - 3rem, weight 700)</span>
                <p className="text-h2">The Breakdown &amp; Case Studies</p>
              </div>

              <Hairline />

              <div>
                <span className="font-mono text-xs text-ink-soft block mb-1">h3 (clamp: 1.25rem - 1.75rem, weight 600)</span>
                <p className="text-h3">Five rows: shoot, cut, post, answer comments, send numbers</p>
              </div>

              <Hairline />

              <div>
                <span className="font-mono text-xs text-ink-soft block mb-1">body (clamp: 1rem - 1.125rem, line-height 1.6, min 16px mobile)</span>
                <p className="text-body max-w-2xl text-ink">
                  Famebros Studio runs the Instagram presence of 50+ leading brands in Mumbai. Our work lives directly on their official handles, reaching millions of feeds every single day.
                </p>
              </div>

              <Hairline />

              <div className="flex flex-col sm:flex-row gap-6">
                <div>
                  <span className="font-mono text-xs text-ink-soft block mb-1">small (0.875rem / 14px)</span>
                  <p className="text-small text-ink-soft">
                    Secondary captions, timestamps, and metric verification dates.
                  </p>
                </div>
                <div>
                  <span className="font-mono text-xs text-ink-soft block mb-1">label (0.75rem / 12px uppercase, tracking 0.08em, weight 600)</span>
                  <p className="text-label text-ink">
                    01 / The Wall &bull; Industry Filter &bull; Verified Public Metric
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Hairline />

          {/* 3. Button Variants */}
          <div>
            <SectionLabel label="03 / Buttons" />
            <h3 className="font-display text-xl font-bold mt-2 mb-6">Interactive Button Primitives</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Primary */}
              <div className="border border-line p-6 flex flex-col gap-4">
                <span className="font-mono text-xs text-ink-soft">primary (ink bg, paper text)</span>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" arrow="up-right">
                    WhatsApp Us
                  </Button>
                  <Button variant="primary" arrow="right">
                    Explore Work
                  </Button>
                </div>
              </div>

              {/* Secondary */}
              <div className="border border-line p-6 flex flex-col gap-4">
                <span className="font-mono text-xs text-ink-soft">secondary (transparent, ink border)</span>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary">
                    View The Wall
                  </Button>
                  <Button variant="secondary" arrow="up-right">
                    Open Feed
                  </Button>
                </div>
              </div>

              {/* onDark */}
              <div className="bg-ink p-6 flex flex-col gap-4">
                <span className="font-mono text-xs text-paper/60">onDark (paper bg, ink text)</span>
                <div className="flex flex-wrap gap-3">
                  <Button variant="onDark" arrow="up-right">
                    Start a Project
                  </Button>
                  <Button variant="onDark">
                    Book Call
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Hairline />

          {/* 4. Filter Chips */}
          <div>
            <SectionLabel label="04 / Chips" />
            <h3 className="font-display text-xl font-bold mt-2 mb-6">Filter Chip States (Min height 44px, sharp corners)</h3>
            <div className="flex flex-wrap gap-3">
              {industries.map((ind) => (
                <Chip
                  key={ind}
                  selected={selectedIndustry === ind}
                  onClick={() => setSelectedIndustry(ind)}
                >
                  {ind}
                </Chip>
              ))}
            </div>
            <p className="mt-3 font-mono text-xs text-ink-soft">
              Active filter state: <span className="font-bold text-ink uppercase">{selectedIndustry}</span>
            </p>
          </div>

          <Hairline />

          {/* 5. CreditPill & Highlight */}
          <div>
            <SectionLabel label="05 / Accent Rule & Exceptions" />
            <h3 className="font-display text-xl font-bold mt-2 mb-6">CreditPill &amp; Highlight</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CreditPill */}
              <div className="border border-line p-6 flex flex-col gap-4">
                <span className="font-mono text-xs text-ink-soft">
                  CreditPill (sole fully rounded element, signal bg, ink text)
                </span>
                <div className="flex flex-wrap items-center gap-4">
                  <CreditPill />
                  <CreditPill handle="placeholder_01" />
                </div>
              </div>

              {/* Highlight */}
              <div className="border border-line p-6 flex flex-col gap-4">
                <span className="font-mono text-xs text-ink-soft">
                  Highlight (inline mark behind text)
                </span>
                <p className="font-body text-base text-ink leading-relaxed">
                  We don&apos;t just post content. We create <Highlight>full Instagram dominance</Highlight> for
                  Mumbai&apos;s most demanding luxury and retail brands.
                </p>
              </div>
            </div>
          </div>

          <Hairline />

          {/* 6. Placeholder Tiles */}
          <div>
            <SectionLabel label="06 / Placeholder Tiles" />
            <h3 className="font-display text-xl font-bold mt-2 mb-6">
              Diagnostic Placeholder Aspect Ratios (Pure CSS Hatch)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="font-mono text-xs text-ink-soft block mb-2">9:16 (Reels/Stories)</span>
                <PlaceholderTile aspectRatio="9:16" label="REEL 9:16" />
              </div>
              <div>
                <span className="font-mono text-xs text-ink-soft block mb-2">4:5 (Feed Portrait)</span>
                <PlaceholderTile aspectRatio="4:5" label="PORTRAIT 4:5" />
              </div>
              <div>
                <span className="font-mono text-xs text-ink-soft block mb-2">1:1 (Square Grid)</span>
                <PlaceholderTile aspectRatio="1:1" label="SQUARE 1:1" />
              </div>
              <div>
                <span className="font-mono text-xs text-ink-soft block mb-2">3:4 (Editorial)</span>
                <PlaceholderTile aspectRatio="3:4" label="EDITORIAL 3:4" />
              </div>
            </div>
          </div>

          <Hairline />

          {/* 7. Grid & Breakpoint Debugger */}
          <div>
            <SectionLabel label="07 / Container & Grid System" />
            <div className="flex items-center justify-between mt-2 mb-6">
              <h3 className="font-display text-xl font-bold">Responsive Columns (4-col mobile, 12-col desktop)</h3>
              <div className="font-mono text-xs bg-paper-dark px-2.5 py-1 border border-line">
                Current: <span className="font-bold sm:hidden">MOBILE (4 Cols)</span>
                <span className="hidden sm:inline lg:hidden font-bold">TABLET</span>
                <span className="hidden lg:inline font-bold">DESKTOP (12 Cols)</span>
              </div>
            </div>

            <div className="grid grid-cols-4 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 border border-line bg-paper-dark/60 flex items-center justify-center font-mono text-xs text-ink font-semibold"
                >
                  Col {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
