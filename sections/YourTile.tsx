'use client';

import React, { useState } from 'react';
import Section from '@/components/Section';
import Container from '@/components/Container';
import SectionLabel from '@/components/SectionLabel';
import CreditPill from '@/components/CreditPill';
import Button from '@/components/Button';
import Reveal from '@/components/Reveal';
import { siteConfig } from '@/data/site';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export default function YourTileSection() {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [rawHandle, setRawHandle] = useState('');
  const [need, setNeed] = useState('');
  const [errors, setErrors] = useState<{ name?: string; brand?: string }>({});

  const cleanedHandle = rawHandle.replace(/\s+/g, '').replace(/^@/, '');
  const displayHandle = cleanedHandle ? `@${cleanedHandle}` : '@yourbrand';
  const hasValidHandle = cleanedHandle.length >= 2;

  const handleHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s+/g, '');
    setRawHandle(val);
  };

  const handleHandleBlur = () => {
    if (cleanedHandle) {
      setRawHandle(`@${cleanedHandle}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; brand?: string } = {};
    if (!name.trim()) {
      newErrors.name = 'Please provide your name';
    }
    if (!brand.trim()) {
      newErrors.brand = 'Please provide your brand name';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const instagramValue = cleanedHandle ? `@${cleanedHandle}` : 'not shared';
    const messageParts = [
      `Hi Famebros, I'm ${name.trim()} from ${brand.trim()}.`,
      `Instagram: ${instagramValue}.`,
    ];

    if (need.trim()) {
      messageParts.push(need.trim());
    }

    const fullMessage = messageParts.join(' ');
    const whatsappUrl = buildWhatsAppLink(fullMessage);

    trackEvent('whatsapp_click', { source: 'your_tile_form' });
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Section
      id="your-tile"
      variant="paper"
      ariaLabel="Your Feed - Your feed goes here"
      className="py-[var(--section-py)] border-t border-line"
    >
      <Container>
        {/* Section Heading & Intro in tight compact block */}
        <div className="flex flex-col gap-1">
          <Reveal delay={0}>
            <SectionLabel label="07 / Your feed" />
          </Reveal>
          <Reveal delay={60}>
            <h2 className="font-display text-h1 sm:text-display font-extrabold tracking-tight text-ink">
              Your feed goes here.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-body text-sm sm:text-base text-ink-soft">
              Tell us about your brand. We&apos;ll reply on WhatsApp.
            </p>
          </Reveal>
        </div>

        {/* 2-Column Responsive Layout: Tile aligned to left edge, stretching to form height */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Column: Tile aligned to left edge, stretches to form height */}
          <div className="lg:col-span-5 flex justify-start items-stretch w-full">
            <div
              aria-hidden="true"
              className="relative w-full h-full min-h-[280px] border border-line bg-paper flex flex-col justify-between overflow-hidden select-none"
            >
              {/* Tile center content */}
              <div className="relative flex-1 w-full flex flex-col items-center justify-center p-6 text-center bg-paper-dark/30">
                {hasValidHandle ? (
                  <div className="flex flex-col items-center gap-2 animate-in fade-in duration-200">
                    <span className="font-mono text-xs uppercase tracking-widest text-ink-soft">
                      Next in queue
                    </span>
                    <span className="font-display text-2xl font-extrabold text-ink">
                      {brand.trim() || 'Your Brand'}
                    </span>
                    <span className="font-mono text-xs text-ink-soft">
                      Production ready
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-display text-5xl sm:text-6xl font-light text-ink">
                      +
                    </span>
                    <span className="font-mono text-xs text-ink-soft uppercase tracking-wider">
                      Claim this tile
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom solid ink strip matching Wall tiles */}
              <div className="flex min-h-[40px] items-center justify-between gap-1.5 border-t border-line-on-dark bg-ink px-3 py-2 shrink-0">
                <span className="truncate font-mono text-xs font-semibold text-paper">
                  {displayHandle}
                </span>

                {hasValidHandle && <CreditPill compact />}
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-3.5 sm:gap-4 border border-line bg-paper-dark/20 p-5 sm:p-6 justify-between h-full"
            >
              {/* Row 1: Name and Brand side by side on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Field 1: Your Name (required) */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="yt-name"
                    className="font-mono text-xs font-bold uppercase tracking-wider text-ink"
                  >
                    Your name *
                  </label>
                  <input
                    id="yt-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) {
                        setErrors((prev) => ({ ...prev, name: undefined }));
                      }
                    }}
                    aria-describedby={errors.name ? 'yt-name-err' : undefined}
                    aria-invalid={Boolean(errors.name)}
                    className={`min-h-[42px] text-base sm:text-sm px-3 py-2 border bg-paper text-ink focus-visible:outline-2 focus-visible:outline-ink transition-colors ${
                      errors.name ? 'border-signal ring-1 ring-signal' : 'border-line'
                    }`}
                    placeholder="e.g. Aryan Mehra"
                  />
                  {errors.name && (
                    <span
                      id="yt-name-err"
                      className="font-mono text-[11px] text-signal bg-ink px-1.5 py-0.5 w-fit"
                    >
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Field 2: Brand Name (required) */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="yt-brand"
                    className="font-mono text-xs font-bold uppercase tracking-wider text-ink"
                  >
                    Brand name *
                  </label>
                  <input
                    id="yt-brand"
                    type="text"
                    required
                    autoComplete="organization"
                    value={brand}
                    onChange={(e) => {
                      setBrand(e.target.value);
                      if (errors.brand) {
                        setErrors((prev) => ({ ...prev, brand: undefined }));
                      }
                    }}
                    aria-describedby={errors.brand ? 'yt-brand-err' : undefined}
                    aria-invalid={Boolean(errors.brand)}
                    className={`min-h-[42px] text-base sm:text-sm px-3 py-2 border bg-paper text-ink focus-visible:outline-2 focus-visible:outline-ink transition-colors ${
                      errors.brand ? 'border-signal ring-1 ring-signal' : 'border-line'
                    }`}
                    placeholder="e.g. Mehra Jewels"
                  />
                  {errors.brand && (
                    <span
                      id="yt-brand-err"
                      className="font-mono text-[11px] text-signal bg-ink px-1.5 py-0.5 w-fit"
                    >
                      {errors.brand}
                    </span>
                  )}
                </div>
              </div>

              {/* Field 3: Instagram Handle (optional) */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="yt-handle"
                  className="font-mono text-xs font-bold uppercase tracking-wider text-ink"
                >
                  Instagram handle (optional)
                </label>
                <input
                  id="yt-handle"
                  type="text"
                  value={rawHandle}
                  onChange={handleHandleChange}
                  onBlur={handleHandleBlur}
                  className="min-h-[42px] text-base sm:text-sm px-3 py-2 border border-line bg-paper text-ink focus-visible:outline-2 focus-visible:outline-ink transition-colors"
                  placeholder="@yourbrand"
                />
              </div>

              {/* Field 4: What do you need? (3 rows textarea) */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="yt-need"
                  className="font-mono text-xs font-bold uppercase tracking-wider text-ink"
                >
                  What do you need? (optional)
                </label>
                <textarea
                  id="yt-need"
                  rows={3}
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                  className="text-base sm:text-sm p-2.5 border border-line bg-paper text-ink focus-visible:outline-2 focus-visible:outline-ink resize-none transition-colors"
                  placeholder="Tell us about your brand, what content you need, or where you want to grow..."
                />
              </div>

              {/* Action Buttons & Microcopy */}
              <div className="flex flex-col gap-2 pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  arrow="up-right"
                  className="w-full justify-center text-sm py-2.5"
                >
                  Send on WhatsApp
                </Button>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <a
                    href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(
                      `Inquiry from ${brand.trim() || 'brand'}`
                    )}`}
                    className="font-mono text-xs text-ink hover:text-ink-soft underline"
                  >
                    Or email us
                  </a>

                  <p className="font-mono text-[10px] text-ink-soft">
                    Opens WhatsApp with your message ready.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </Section>
  );
}
