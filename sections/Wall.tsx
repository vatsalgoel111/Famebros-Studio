'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Section from '@/components/Section';
import Container from '@/components/Container';
import SectionLabel from '@/components/SectionLabel';
import WallTile from '@/components/WallTile';
import ClientPanel from '@/components/ClientPanel';
import Reveal from '@/components/Reveal';
import { getWallClients, getLiveCount, isWallEnabled } from '@/lib/wall';
import { Client } from '@/types';
import { trackEvent } from '@/lib/analytics';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function WallSection() {
  const isReducedMotion = useReducedMotion();
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [filterState] = useState<'idle' | 'leaving' | 'entering'>('idle');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleClientSelect = (client: Client) => {
    trackEvent('wall_tile_open', { client: client.handle });
    setSelectedClient(client);
  };

  // Carousel scroll state
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [positionText, setPositionText] = useState('1-5 of 5');
  const [scrollProgress, setScrollProgress] = useState(0);

  const carouselRef = useRef<HTMLDivElement | null>(null);

  const liveCount = useMemo(() => getLiveCount(), []);
  const allWallClients = useMemo(() => getWallClients(), []);
  const displayedClients = allWallClients;
  const totalTileCount = displayedClients.length + 1; // +1 for "Your feed" tile

  // Update scroll boundaries, position indicator, and progress line
  const updateScrollState = useCallback(() => {
    const container = carouselRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScroll = Math.max(0, scrollWidth - clientWidth);

    setCanScrollPrev(scrollLeft > 2);
    setCanScrollNext(scrollLeft < maxScroll - 2);

    const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
    setScrollProgress(progress);

    // Determine visible items index range
    const items = Array.from(container.children) as HTMLElement[];
    if (items.length === 0) return;

    const leftBound = scrollLeft + 2;
    const rightBound = scrollLeft + clientWidth - 2;
    let firstIdx = -1;
    let lastIdx = -1;

    items.forEach((item, idx) => {
      const itemLeft = item.offsetLeft;
      const itemRight = itemLeft + item.clientWidth;
      if (itemRight > leftBound && itemLeft < rightBound) {
        if (firstIdx === -1) firstIdx = idx + 1;
        lastIdx = idx + 1;
      }
    });

    if (firstIdx === -1) firstIdx = 1;
    if (lastIdx === -1) lastIdx = Math.min(items.length, 5);

    setPositionText(`${firstIdx}-${lastIdx} of ${items.length}`);
  }, []);

  // RequestAnimationFrame throttled scroll listener
  useEffect(() => {
    if (viewMode !== 'carousel') return;
    const container = carouselRef.current;
    if (!container) return;

    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updateScrollState();
        rafId = null;
      });
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateScrollState();

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [viewMode, updateScrollState, displayedClients]);

  // Scroll by one page: visible width minus one tile
  const scrollByPage = (direction: 'prev' | 'next') => {
    const container = carouselRef.current;
    if (!container) return;
    const firstChild = container.firstElementChild as HTMLElement | null;
    const tileWidth = firstChild ? firstChild.clientWidth : 240;
    const pageSize = Math.max(tileWidth, container.clientWidth - tileWidth);
    const amount = direction === 'next' ? pageSize : -pageSize;

    container.scrollBy({
      left: amount,
      behavior: isReducedMotion ? 'auto' : 'smooth',
    });
  };

  // Keyboard navigation for carousel container
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollByPage('prev');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollByPage('next');
    }
  };

  if (!isWallEnabled()) {
    return null;
  }

  return (
    <>
      <Section
        id="wall"
        variant="paper"
        ariaLabel="The Wall - Every feed we run"
        className="py-[var(--section-py)]"
      >
        <Container>
          {/* Section Header Row: Title on left, Carousel controls & See all on right */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-3 sm:pb-4">
            {/* Section Heading & Intro in one tight compact block */}
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <Reveal delay={0}>
                <SectionLabel label="01 / The Wall" />
              </Reveal>
              <Reveal delay={60}>
                <h2 className="font-display text-h1 sm:text-display font-extrabold tracking-tight text-ink">
                  Every feed we run.
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="font-body text-sm sm:text-base text-ink-soft">
                    Tap one. That&apos;s us behind it.
                  </p>
                  {liveCount > 0 && (
                    <span className="font-mono text-xs font-semibold text-ink uppercase tracking-wider">
                      &bull; {liveCount} {liveCount === 1 ? 'feed' : 'feeds'} we run
                    </span>
                  )}
                </div>
              </Reveal>
            </div>

            {/* Desktop Controls (Carousel Prev/Next and See All / Back toggle) */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              {totalTileCount > 8 && (
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === 'carousel' ? 'grid' : 'carousel')}
                  className="border border-line bg-paper px-3 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-ink hover:border-ink hover:bg-paper-dark/30 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-ink"
                >
                  {viewMode === 'carousel' ? `See all ${totalTileCount}` : 'Back to carousel'}
                </button>
              )}

              {viewMode === 'carousel' && (
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs tabular-nums text-ink-soft font-semibold">
                    {positionText}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => scrollByPage('prev')}
                      disabled={!canScrollPrev}
                      aria-disabled={!canScrollPrev}
                      aria-label="Previous clients"
                      className="flex h-12 w-12 items-center justify-center border border-line bg-paper text-ink hover:border-ink hover:bg-paper-dark/30 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus-visible:outline-2 focus-visible:outline-ink"
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollByPage('next')}
                      disabled={!canScrollNext}
                      aria-disabled={!canScrollNext}
                      aria-label="Next clients"
                      className="flex h-12 w-12 items-center justify-center border border-line bg-paper text-ink hover:border-ink hover:bg-paper-dark/30 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus-visible:outline-2 focus-visible:outline-ink"
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="flex sm:hidden items-center justify-between mt-3 pt-2 border-b border-line/40 pb-2">
            <div>
              {totalTileCount > 8 && (
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === 'carousel' ? 'grid' : 'carousel')}
                  className="border border-line bg-paper px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-ink hover:border-ink transition-colors cursor-pointer"
                >
                  {viewMode === 'carousel' ? `See all ${totalTileCount}` : 'Back to carousel'}
                </button>
              )}
            </div>

            {viewMode === 'carousel' && (
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs tabular-nums text-ink-soft font-semibold mr-1">
                  {positionText}
                </span>
                <button
                  type="button"
                  onClick={() => scrollByPage('prev')}
                  disabled={!canScrollPrev}
                  aria-disabled={!canScrollPrev}
                  aria-label="Previous clients"
                  className="flex h-10 w-10 items-center justify-center border border-line bg-paper text-ink hover:border-ink disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus-visible:outline-2 focus-visible:outline-ink"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByPage('next')}
                  disabled={!canScrollNext}
                  aria-disabled={!canScrollNext}
                  aria-label="Next clients"
                  className="flex h-10 w-10 items-center justify-center border border-line bg-paper text-ink hover:border-ink disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus-visible:outline-2 focus-visible:outline-ink"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {/* VIEW MODE 1: Horizontal Carousel (Default) */}
          {viewMode === 'carousel' ? (
            <div className="mt-3 sm:mt-4 flex flex-col">
              <div
                ref={carouselRef}
                tabIndex={0}
                role="region"
                aria-label="Clients feed carousel"
                onKeyDown={handleKeyDown}
                className="flex gap-4 overflow-x-auto snap-x snap-proximity overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-1 focus-visible:outline-2 focus-visible:outline-ink"
              >
                {displayedClients.map((client, index) => {
                  const staggerDelay = Math.min(index * 20, 300);

                  const tileStyle: React.CSSProperties =
                    filterState === 'leaving'
                      ? {
                          opacity: 0,
                          transitionProperty: 'opacity',
                          transitionDuration: 'var(--dur-fast)',
                          transitionTimingFunction: 'var(--ease-out)',
                          transitionDelay: '0ms',
                        }
                      : filterState === 'entering'
                        ? {
                            opacity: 1,
                            transitionProperty: 'opacity',
                            transitionDuration: 'var(--dur-base)',
                            transitionTimingFunction: 'var(--ease-out)',
                            transitionDelay: `${staggerDelay}ms`,
                          }
                        : {
                            opacity: 1,
                            transitionProperty: 'opacity',
                            transitionDuration: '0ms',
                            transitionDelay: '0ms',
                          };

                  return (
                    <div
                      key={client.id}
                      className="w-[62vw] max-w-[260px] sm:w-[34vw] sm:max-w-none lg:w-[calc((100%-4*1rem)/5)] shrink-0 aspect-[3/4] lg:max-h-[calc(100dvh-var(--header-h)-230px)] snap-start flex flex-col"
                      onFocus={(e) => {
                        e.currentTarget.scrollIntoView({
                          behavior: 'smooth',
                          block: 'nearest',
                          inline: 'nearest',
                        });
                      }}
                    >
                      <WallTile
                        client={client}
                        style={tileStyle}
                        onClick={handleClientSelect}
                        className="h-full w-full"
                      />
                    </div>
                  );
                })}

                {/* "Your Feed" Tile: Always the last item in carousel */}
                <div
                  className="w-[62vw] max-w-[260px] sm:w-[34vw] sm:max-w-none lg:w-[calc((100%-4*1rem)/5)] shrink-0 aspect-[3/4] lg:max-h-[calc(100dvh-var(--header-h)-230px)] snap-start flex flex-col"
                  onFocus={(e) => {
                    e.currentTarget.scrollIntoView({
                      behavior: 'smooth',
                      block: 'nearest',
                      inline: 'nearest',
                    });
                  }}
                >
                  <a
                    href="#your-tile"
                    aria-label="Your feed goes here. Jump to project inquiry."
                    className="group relative flex h-full w-full flex-col items-center justify-center border border-line bg-paper-dark/30 p-3 text-center transition-colors duration-[var(--dur-fast)] hover:border-ink hover:bg-paper-dark focus-visible:outline-2 focus-visible:outline-ink select-none"
                  >
                    <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2">
                      <span className="font-display text-3xl sm:text-5xl font-light text-ink transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:rotate-90 group-focus-visible:rotate-90 motion-reduce:transform-none motion-reduce:rotate-0 inline-block">
                        +
                      </span>
                      <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-wider text-ink">
                        Your feed
                      </span>
                      <span className="font-mono text-[10px] text-ink-soft">
                        Next slot open
                      </span>
                    </div>
                  </a>
                </div>
              </div>

              {/* 2px progress line under the carousel row */}
              <div
                className="w-full h-[2px] bg-paper-dark mt-3 sm:mt-4 relative overflow-hidden"
                aria-hidden="true"
              >
                <div
                  className="h-full bg-ink origin-left transition-transform duration-75"
                  style={{
                    transform: `scaleX(${Math.max(0.08, scrollProgress)})`,
                    transformOrigin: 'left',
                  }}
                />
              </div>
            </div>
          ) : (
            /* VIEW MODE 2: Full Mosaic Grid */
            <div className="grid grid-cols-2 min-[360px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 min-[1440px]:grid-cols-8 gap-2 sm:gap-3 lg:gap-3.5 mt-3 sm:mt-4">
              {displayedClients.map((client, index) => {
                const staggerDelay = Math.min(index * 20, 300);

                const tileStyle: React.CSSProperties =
                  filterState === 'leaving'
                    ? {
                        opacity: 0,
                        transitionProperty: 'opacity',
                        transitionDuration: 'var(--dur-fast)',
                        transitionTimingFunction: 'var(--ease-out)',
                        transitionDelay: '0ms',
                      }
                    : filterState === 'entering'
                      ? {
                          opacity: 1,
                          transitionProperty: 'opacity',
                          transitionDuration: 'var(--dur-base)',
                          transitionTimingFunction: 'var(--ease-out)',
                          transitionDelay: `${staggerDelay}ms`,
                        }
                      : {
                          opacity: 1,
                          transitionProperty: 'opacity',
                          transitionDuration: '0ms',
                          transitionDelay: '0ms',
                        };

                return (
                  <WallTile
                    key={client.id}
                    client={client}
                    style={tileStyle}
                    onClick={handleClientSelect}
                  />
                );
              })}

              {/* "Your Feed" Tile: Always the last item in grid */}
              <a
                href="#your-tile"
                aria-label="Your feed goes here. Jump to project inquiry."
                className="group relative flex w-full aspect-[3/4] flex-col items-center justify-center border border-line bg-paper-dark/30 p-3 text-center transition-colors duration-[var(--dur-fast)] hover:border-ink hover:bg-paper-dark focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 select-none"
              >
                <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2">
                  <span className="font-display text-3xl sm:text-5xl font-light text-ink transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:rotate-90 group-focus-visible:rotate-90 motion-reduce:transform-none motion-reduce:rotate-0 inline-block">
                    +
                  </span>
                  <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-wider text-ink">
                    Your feed
                  </span>
                  <span className="font-mono text-[10px] text-ink-soft hidden sm:block">
                    Next slot open
                  </span>
                </div>
              </a>
            </div>
          )}
        </Container>
      </Section>

      {/* Client Dossier Modal / Bottom Sheet */}
      <ClientPanel
        client={selectedClient}
        onClose={() => setSelectedClient(null)}
      />
    </>
  );
}
