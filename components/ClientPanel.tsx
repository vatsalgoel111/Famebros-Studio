'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Play, ArrowUpRight } from 'lucide-react';
import { Client, Post } from '@/types';
import { posts } from '@/data/posts';
import { siteConfig } from '@/data/site';
import CreditPill from '@/components/CreditPill';
import PlaceholderTile from '@/components/PlaceholderTile';
import FadeImage from '@/components/FadeImage';
import Button from '@/components/Button';
import Hairline from '@/components/Hairline';
import { mediaUrl } from '@/lib/media';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  register as registerPlaybackLock,
  claim as claimPlaybackLock,
  release as releasePlaybackLock,
} from '@/lib/playbackLock';

export interface ClientPanelProps {
  client: Client | null;
  onClose: () => void;
}

export default function ClientPanel({ client, onClose }: ClientPanelProps) {
  const isReducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const [activePlayingPostId, setActivePlayingPostId] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [prevClient, setPrevClient] = useState<Client | null>(client);

  if (client !== null && client !== prevClient) {
    setPrevClient(client);
  }

  // Smooth exit handler (transform + opacity over --dur-base)
  const handleClose = useCallback(() => {
    if (isReducedMotion) {
      onClose();
      return;
    }

    setIsExiting(true);
    setTimeout(() => {
      onClose();
      setIsExiting(false);
    }, 250);
  }, [isReducedMotion, onClose]);

  // Playback lock registration for ClientPanel videos
  useEffect(() => {
    const unregister = registerPlaybackLock('client-panel-video', () => {
      setActivePlayingPostId(null);
    });
    return () => {
      unregister();
      releasePlaybackLock('client-panel-video');
    };
  }, []);

  useEffect(() => {
    if (activePlayingPostId) {
      claimPlaybackLock('client-panel-video');
    }
  }, [activePlayingPostId]);

  // Store trigger element focus and manage iOS-safe focus trap
  useEffect(() => {
    if (client) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      const timeout = setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
          return;
        }

        if (e.key === 'Tab' && panelRef.current) {
          const focusable = panelRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(timeout);
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
        previousFocusRef.current?.focus();
      };
    }
  }, [client, handleClose]);

  if (!client && !isExiting) return null;

  const currentClient = client || prevClient;
  if (!currentClient) return null;

  // Filter posts for this client
  const clientPosts: Post[] = posts.filter((p) => p.clientId === currentClient.id);

  // Find if any post has verified metric
  const postWithMetric = clientPosts.find((p) => Boolean(p.publicMetric));

  // Determine WhatsApp greeting message
  const waText = currentClient.isPlaceholder
    ? 'Hi Famebros, I saw your wall and want something like it for my brand.'
    : `Hi Famebros, I saw ${currentClient.handle} on your wall and want something like it for my brand.`;
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(waText)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="client-panel-title"
      className="fixed inset-0 z-50 flex justify-end items-end md:items-stretch"
    >
      {/* Solid Ink Backdrop at 60% opacity with smooth fade (no blur) */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-ink/60 transition-opacity duration-[var(--dur-base)] ease-[var(--ease-out)] ${
          isExiting ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden="true"
      />

      {/* Slide-over sheet / panel: Solid paper background, hairline border, no shadow */}
      <div
        ref={panelRef}
        className={`relative z-10 w-full md:w-[480px] max-h-[88dvh] md:max-h-none h-auto md:h-full overflow-y-auto overscroll-contain bg-paper text-ink border-t md:border-t-0 md:border-l border-line p-6 sm:p-8 pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] flex flex-col gap-6 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:transform-none ${
          isExiting
            ? 'translate-y-full md:translate-y-0 md:translate-x-full'
            : 'translate-y-0 md:translate-x-0'
        }`}
      >
        {/* Top Bar with Close Button */}
        <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-ink-soft uppercase tracking-wider">
              Client Dossier
            </span>
            <span className="font-mono text-sm font-semibold text-ink">
              {currentClient.handle}
            </span>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={handleClose}
            aria-label="Close client details panel"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center border border-line bg-paper text-ink hover:bg-paper-dark focus-visible:outline-2 focus-visible:outline-ink cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* 1. Handle + DisplayName, Industry, City */}
        <div className="flex flex-col gap-2">
          <h2
            id="client-panel-title"
            className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-ink"
          >
            {currentClient.displayName}
          </h2>

          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-label text-ink-soft bg-paper-dark px-2.5 py-1 border border-line">
              {currentClient.industry}
            </span>
            <span className="text-label text-ink-soft bg-paper-dark px-2.5 py-1 border border-line">
              {currentClient.city}
            </span>
            {currentClient.isPlaceholder && (
              <span className="text-label bg-signal text-ink px-2.5 py-1 font-bold">
                Placeholder Record
              </span>
            )}
          </div>
        </div>

        {/* 2. Full CreditPill */}
        <div>
          <CreditPill />
        </div>

        <Hairline />

        {/* 3. What We Run */}
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-sm uppercase tracking-wider font-bold text-ink">
            What We Run
          </h3>
          {currentClient.servicesWeRun && currentClient.servicesWeRun.length > 0 ? (
            <ul className="grid grid-cols-1 gap-2 border border-line bg-paper-dark/20 p-3">
              {currentClient.servicesWeRun.map((svc) => (
                <li
                  key={svc}
                  className="font-body text-sm text-ink flex items-center gap-2.5"
                >
                  <span
                    className="h-1.5 w-1.5 bg-ink shrink-0"
                    aria-hidden="true"
                  />
                  <span>{svc}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-body text-sm text-ink-soft">
              Details coming soon
            </p>
          )}
        </div>

        <Hairline />

        {/* 4. Best Posts (Up to 3, filled with 9:16 placeholders) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm uppercase tracking-wider font-bold text-ink">
              Best Posts
            </h3>
            <span className="font-mono text-xs text-ink-soft">3 Highlights</span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[0, 1, 2].map((slotIdx) => {
              const post = clientPosts[slotIdx];

              if (!post) {
                return (
                  <div key={slotIdx} className="w-full">
                    <PlaceholderTile
                      aspectRatio="9:16"
                      label="PLACEHOLDER POST"
                      className="border border-line h-full"
                    />
                  </div>
                );
              }

              const isPlayingThis = activePlayingPostId === post.id;
              const hasRealPoster = Boolean(post.poster && !post.poster.startsWith('/placeholders/'));
              const postAlt =
                post.posterAlt ||
                (hasRealPoster
                  ? (typeof window !== 'undefined' &&
                      process.env.NODE_ENV !== 'production' &&
                      console.warn(`[A11y Warning] Missing posterAlt for post ${post.id}`),
                    `Post preview reel for ${currentClient.handle}`)
                  : `Post preview reel for ${currentClient.handle}`);

              return (
                <div
                  key={post.id}
                  className="relative aspect-[9/16] w-full border border-line overflow-hidden bg-paper-dark"
                >
                  {post.videoSrc ? (
                    isPlayingThis ? (
                      <video
                        src={mediaUrl(post.videoSrc)}
                        poster={mediaUrl(post.poster)}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActivePlayingPostId(post.id)}
                        aria-label={`Play post video ${slotIdx + 1}`}
                        className="group relative h-full w-full flex items-center justify-center cursor-pointer"
                      >
                        {hasRealPoster ? (
                          <FadeImage
                            src={mediaUrl(post.poster)}
                            alt={postAlt}
                            fill
                            sizes="(max-width: 768px) 30vw, 140px"
                            className="object-cover"
                          />
                        ) : (
                          <PlaceholderTile
                            aspectRatio="9:16"
                            label="REEL"
                            className="h-full w-full border-0 pointer-events-none"
                          />
                        )}
                        <span className="absolute z-10 flex h-9 w-9 items-center justify-center bg-ink text-paper group-hover:bg-signal group-hover:text-ink transition-colors">
                          <Play className="h-4 w-4 fill-current ml-0.5" />
                        </span>
                      </button>
                    )
                  ) : hasRealPoster ? (
                    <FadeImage
                      src={mediaUrl(post.poster)}
                      alt={postAlt}
                      fill
                      sizes="(max-width: 768px) 30vw, 140px"
                      className="object-cover"
                    />
                  ) : (
                    <PlaceholderTile
                      aspectRatio="9:16"
                      label="PLACEHOLDER POST"
                      className="h-full w-full border-0"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Hairline />

        {/* 5. The Number */}
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-sm uppercase tracking-wider font-bold text-ink">
            The Number
          </h3>

          {postWithMetric?.publicMetric ? (
            <div className="border border-line bg-paper-dark/30 p-4 flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-soft">
                  {postWithMetric.publicMetric.label}
                </span>
                <span className="font-mono text-xs text-ink-soft">
                  verified {postWithMetric.publicMetric.verifiedOn}
                </span>
              </div>

              <div className="font-display text-3xl font-extrabold text-ink">
                {postWithMetric.publicMetric.value}
              </div>

              {postWithMetric.instagramUrl && (
                <a
                  href={postWithMetric.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-body text-xs font-semibold text-ink hover:text-ink-soft underline mt-1"
                >
                  <span>Open on Instagram</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
          ) : (
            <div className="placeholder-hatch border border-line p-6 flex flex-col items-center justify-center text-center">
              <div className="bg-paper border border-line px-3 py-1 font-mono text-xs uppercase tracking-wider text-ink-soft">
                PUBLIC METRIC GOES HERE
              </div>
              <p className="font-body text-xs text-ink-soft/80 mt-2 max-w-xs">
                Verified view counts and save metrics will be populated upon official client post link.
              </p>
            </div>
          )}
        </div>

        <Hairline />

        {/* 6. CTA & 7. Instagram Link */}
        <div className="flex flex-col gap-3 pt-2">
          <Button
            variant="primary"
            href={whatsappUrl}
            arrow="up-right"
            className="w-full justify-center"
          >
            Want this for your brand?
          </Button>

          {!currentClient.isPlaceholder && (
            <a
              href={`https://instagram.com/${currentClient.handle.replace(/^@/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 font-mono text-xs font-medium text-ink hover:text-ink-soft transition-colors py-2"
            >
              <span>View on Instagram</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
