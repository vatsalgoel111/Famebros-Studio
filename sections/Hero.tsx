'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import Image from 'next/image';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import Container from '@/components/Container';
import SectionLabel from '@/components/SectionLabel';
import Highlight from '@/components/Highlight';
import Button from '@/components/Button';
import CreditPill from '@/components/CreditPill';
import PlaceholderTile from '@/components/PlaceholderTile';
import { heroClips } from '@/data/hero';
import { clients } from '@/data/clients';
import { siteConfig } from '@/data/site';
import { mediaUrl } from '@/lib/media';
import { isWallEnabled } from '@/lib/wall';
import { trackEvent } from '@/lib/analytics';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  register as registerPlaybackLock,
  claim as claimPlaybackLock,
  release as releasePlaybackLock,
} from '@/lib/playbackLock';

export default function HeroSection() {
  const isReducedMotion = useReducedMotion();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const heroRef = useRef<HTMLElement>(null);
  const isIntersectingRef = useRef(true);
  const isDocumentVisibleRef = useRef(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const totalClips = heroClips.length;
  const currentClip = heroClips[currentIndex];
  const isPlaying = !isReducedMotion && !userPaused;

  const linkedClient = currentClip.clientId
    ? clients.find((c) => c.id === currentClip.clientId)
    : undefined;

  const isClientPermitted = Boolean(
    linkedClient && linkedClient.hasPermission && !linkedClient.isPlaceholder
  );

  const activeCaptionEnding =
    isClientPermitted && currentClip.captionEndingNamed
      ? currentClip.captionEndingNamed
      : currentClip.captionEnding;

  const wallActive = isWallEnabled();

  const whatsappMessage = encodeURIComponent(
    "Hi Famebros, I'd like to talk about my brand's Instagram."
  );
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${whatsappMessage}`;

  // Step function with 200ms opacity cross-fade
  const stepTo = useCallback(
    (nextIdx: number) => {
      setIsFading(true);
      setTimeout(() => {
        const target = (nextIdx + totalClips) % totalClips;
        setCurrentIndex(target);
        setProgress(0);
        setIsFading(false);
      }, 100);
    },
    [totalClips]
  );

  const nextClip = useCallback(() => {
    stepTo(currentIndex + 1);
  }, [currentIndex, stepTo]);

  const prevClip = useCallback(() => {
    stepTo(currentIndex - 1);
  }, [currentIndex, stepTo]);

  // Tab visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      isDocumentVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // IntersectionObserver to pause when off-screen
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-advance loop (3 seconds) & segment progress tracking
  useEffect(() => {
    if (isReducedMotion || !isPlaying) return;

    const duration = 3000;
    const intervalTime = 50;
    let elapsed = 0;

    const interval = setInterval(() => {
      if (!isIntersectingRef.current || !isDocumentVisibleRef.current) {
        return;
      }

      elapsed += intervalTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      if (elapsed >= duration) {
        nextClip();
        elapsed = 0;
        setProgress(0);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, isReducedMotion, nextClip]);

  // Register playback lock so any other video claim pauses the hero reel
  useEffect(() => {
    const unregister = registerPlaybackLock('hero-reel', () => {
      setUserPaused(true);
    });
    return () => {
      unregister();
      releasePlaybackLock('hero-reel');
    };
  }, []);

  // Handle active video playback
  useEffect(() => {
    if (isPlaying) {
      claimPlaybackLock('hero-reel');
    }
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === currentIndex && isPlaying && isIntersectingRef.current) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [currentIndex, isPlaying]);

  // Shared Reel Viewer component for unified playback
  const renderReelViewer = (isMobileView: boolean) => (
    <div
      role="region"
      aria-label="Featured reel preview"
      className={
        isMobileView
          ? 'relative w-full h-full flex flex-col overflow-hidden bg-ink select-none'
          : 'relative aspect-[9/16] h-[calc(100dvh-var(--header-h)-48px)] max-h-[calc(100dvh-var(--header-h)-48px)] w-auto max-w-full border border-line-on-dark bg-ink overflow-hidden select-none flex flex-col shrink-0'
      }
    >
      {/* Top Stories Progress Bar (6 segments) */}
      <div
        className="absolute top-3 left-3 right-3 z-30 flex gap-1.5 pointer-events-none"
        aria-hidden="true"
      >
        {heroClips.map((clip, idx) => {
          const isPast = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <div
              key={clip.id}
              className="h-[2px] flex-1 bg-paper/25 overflow-hidden"
            >
              <div
                className="h-full bg-paper"
                style={{
                  width: isPast
                    ? '100%'
                    : isCurrent
                      ? isReducedMotion
                        ? '100%'
                        : `${progress}%`
                      : '0%',
                  transitionProperty: 'width',
                  transitionDuration:
                    isCurrent && !isReducedMotion ? '0ms' : '150ms',
                  transitionTimingFunction: 'var(--ease-out)',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Accessible Controls: Previous, Play/Pause, Next */}
      <div className="absolute top-6 right-3 z-30 flex items-center gap-1 bg-ink/80 border border-line-on-dark p-1">
        <button
          type="button"
          onClick={prevClip}
          aria-label="Previous reel"
          className="flex h-7 w-7 items-center justify-center text-paper hover:text-signal focus-visible:outline-2 focus-visible:outline-paper cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setUserPaused(!userPaused)}
          aria-label={isPlaying ? 'Pause reel preview' : 'Play reel preview'}
          className="flex h-7 w-7 items-center justify-center text-paper hover:text-signal focus-visible:outline-2 focus-visible:outline-paper cursor-pointer"
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          onClick={nextClip}
          aria-label="Next reel"
          className="flex h-7 w-7 items-center justify-center text-paper hover:text-signal focus-visible:outline-2 focus-visible:outline-paper cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Tap Left / Right Zones */}
      <button
        type="button"
        onClick={prevClip}
        aria-label="Tap previous"
        className="absolute left-0 top-0 bottom-0 w-1/3 z-20 opacity-0 cursor-pointer focus-visible:opacity-20 focus-visible:bg-paper"
      />
      <button
        type="button"
        onClick={nextClip}
        aria-label="Tap next"
        className="absolute right-0 top-0 bottom-0 w-1/3 z-20 opacity-0 cursor-pointer focus-visible:opacity-20 focus-visible:bg-paper"
      />

      {/* Media Content */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-paper-dark">
        {currentClip.videoSrc ? (
          <video
            ref={(el) => {
              videoRefs.current[currentIndex] = el;
            }}
            src={mediaUrl(currentClip.videoSrc)}
            poster={mediaUrl(currentClip.poster)}
            muted
            loop
            playsInline
            preload={currentIndex === 0 ? 'metadata' : 'none'}
            className="h-full w-full object-cover"
          />
        ) : currentClip.poster ? (
          <Image
            src={mediaUrl(currentClip.poster)}
            alt={
              currentClip.posterAlt ||
              (!currentClip.isPlaceholder
                ? (typeof window !== 'undefined' &&
                    process.env.NODE_ENV !== 'production' &&
                    console.warn(`[A11y Warning] Missing posterAlt for hero clip: ${currentClip.id}`),
                  `Preview reel for ${currentClip.handle}`)
                : `Preview reel for ${currentClip.handle}`)
            }
            fill
            priority={currentIndex === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 380px, 420px"
            referrerPolicy="no-referrer"
            className="object-cover"
          />
        ) : (
          <PlaceholderTile
            aspectRatio="9:16"
            label={`PLACEHOLDER REEL ${currentIndex + 1}/${totalClips}`}
            caption={currentClip.handle}
            className="h-full w-full border-0"
          />
        )}
      </div>

      {/* Credit Pill at bottom-left inside frame */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
        {isClientPermitted && linkedClient ? (
          <CreditPill handle={linkedClient.handle} />
        ) : (
          <CreditPill role="made" />
        )}
      </div>
    </div>
  );

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-label="Famebros Studio Introduction"
      data-theme="dark"
      className="relative w-full scroll-mt-[var(--header-h)] bg-ink text-paper overflow-hidden border-b border-line-on-dark md:h-[calc(100dvh-var(--header-h))] md:max-h-[calc(100dvh-var(--header-h))]"
    >
      {/* Accessible Landmark H1 for the page */}
      <h1 className="sr-only">
        Famebros Studio — You&apos;ve already seen our work.
      </h1>

      {/* MOBILE LAYOUT (< 768px): Frame fills width & most viewport height (dvh minus header & bottom bar) */}
      <div className="flex md:hidden flex-col h-[calc(100dvh-4rem-4.5rem)] [@media(max-height:500px)]:h-auto [@media(max-height:500px)]:min-h-0 w-full border-b border-line-on-dark">
        {/* Frame fills viewport */}
        <div className="relative flex-1 w-full overflow-hidden [@media(max-height:500px)]:flex-none [@media(max-height:500px)]:h-[240px] [@media(max-height:500px)]:py-1">
          {renderReelViewer(true)}
        </div>

        {/* Solid ink strip behind headline (NOT a gradient or blur) */}
        <div className="bg-ink p-4 border-t border-line-on-dark flex flex-col gap-2.5 z-30 shrink-0">
          <SectionLabel label="00 / Studio Introduction" dark />
          <p
            aria-hidden="true"
            className="font-display text-2xl font-bold tracking-tight text-paper leading-tight"
          >
            You&apos;ve <Highlight animate>already</Highlight> seen our work.
          </p>

          {/* Reserved min-height prevents layout shift while supporting text scaling */}
          <div className="min-h-[1.5rem] flex items-center overflow-hidden" aria-hidden="true">
            <p
              style={{ opacity: isFading ? 0 : 1 }}
              className="font-display text-xs sm:text-sm font-medium text-paper/80 transition-opacity duration-200"
            >
              ...{activeCaptionEnding}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              variant="onDark"
              href={wallActive ? '#wall' : '#breakdown'}
              className="text-xs py-2 min-h-[44px] justify-center"
            >
              {wallActive ? 'See the wall' : 'See our work'}
            </Button>
            <Button
              variant="secondaryOnDark"
              href={whatsappUrl}
              arrow="up-right"
              className="text-xs py-2 min-h-[44px] justify-center"
              ariaLabel="WhatsApp Famebros Studio"
              onClick={() => trackEvent('whatsapp_click', { source: 'hero_mobile' })}
            >
              WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT (>= 768px): Two columns, exactly fitting under header without scrolling */}
      <div className="hidden md:flex h-full w-full items-center py-4 lg:py-6">
        <Container className="h-full flex items-center">
          <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center w-full h-full">
            {/* Left Column (Desktop headline, CTAs, and ProofStrip) */}
            <div className="col-span-7 flex flex-col justify-center z-10 pr-4">
              <SectionLabel label="00 / Studio Introduction" dark className="mb-3" />

              <p
                aria-hidden="true"
                className="font-display text-display font-extrabold tracking-tight text-paper"
              >
                You&apos;ve <Highlight animate>already</Highlight> seen our work.
              </p>

              {/* Swapping caption with reserved min-height */}
              <div
                className="mt-3 lg:mt-4 min-h-[2rem] lg:min-h-[2.5rem] flex items-center overflow-hidden"
                aria-hidden="true"
              >
                <p
                  style={{ opacity: isFading ? 0 : 1 }}
                  className="font-display text-lg sm:text-xl lg:text-2xl font-medium tracking-tight text-paper/80 transition-opacity duration-200"
                >
                  ...{activeCaptionEnding}
                </p>
              </div>

              {/* CTAs */}
              <div className="mt-5 lg:mt-6 flex flex-wrap items-center gap-4">
                <Button
                  variant="onDark"
                  href={wallActive ? '#wall' : '#breakdown'}
                  arrow="right"
                >
                  {wallActive ? 'See the wall' : 'See our work'}
                </Button>
                <Button
                  variant="secondaryOnDark"
                  href={whatsappUrl}
                  arrow="up-right"
                  ariaLabel="WhatsApp Famebros Studio"
                  onClick={() => trackEvent('whatsapp_click', { source: 'hero' })}
                >
                  WhatsApp us
                </Button>
              </div>

              {/* ProofStrip */}
              <div className="mt-6 pt-4 border-t border-line-on-dark flex flex-wrap items-center gap-6 font-mono text-xs text-paper/70">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-signal shrink-0" aria-hidden="true" />
                  <span>50+ feeds run in Mumbai</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-signal shrink-0" aria-hidden="true" />
                  <span>Managed by Famebros</span>
                </div>
                {siteConfig.since && (
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-signal shrink-0" aria-hidden="true" />
                    <span>On Instagram since {siteConfig.since}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (Height-constrained Reel Frame) */}
            <div className="col-span-5 flex justify-center items-center h-full w-full">
              {renderReelViewer(false)}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
