'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Post, Client, BreakdownMarker } from '@/types';
import CreditPill from '@/components/CreditPill';
import PlaceholderTile from '@/components/PlaceholderTile';
import { UseTimelineReturn } from '@/hooks/useTimeline';
import { mediaUrl } from '@/lib/media';

export interface BreakdownPlayerProps {
  post: Post;
  client: Client;
  markers: BreakdownMarker[];
  activeMarkerIndex: number;
  onMarkerSelect: (marker: BreakdownMarker) => void;
  timeline: UseTimelineReturn;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isMuted: boolean;
  onToggleMute: () => void;
}

function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export default function BreakdownPlayer({
  post,
  client,
  markers,
  activeMarkerIndex,
  onMarkerSelect,
  timeline,
  videoRef,
  isMuted,
  onToggleMute,
}: BreakdownPlayerProps) {
  const { currentTime, duration, playing, togglePlay, seek } = timeline;

  const hasVideoSrc = Boolean(post.videoSrc);
  const currentTimeFormatted = formatTime(currentTime);
  const durationFormatted = formatTime(duration);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      seek(currentTime - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      seek(currentTime + 1);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-[320px] lg:max-w-none lg:w-auto items-center">
      {/* 9:16 Reel Frame */}
      <div
        role="region"
        aria-label={`Case study reel for ${client.handle}`}
        className="relative aspect-[9/16] h-[calc(100dvh-var(--header-h)-210px)] max-h-[calc(100dvh-var(--header-h)-200px)] w-auto max-w-full border border-line-on-dark bg-ink overflow-hidden select-none flex flex-col group shrink-0"
      >
        {/* Video / Placeholder media */}
        <div className="relative flex-1 w-full h-full overflow-hidden bg-paper-dark">
          {hasVideoSrc ? (
            <video
              ref={videoRef}
              src={mediaUrl(post.videoSrc)}
              poster={mediaUrl(post.poster)}
              playsInline
              preload="none"
              muted={isMuted}
              className="h-full w-full object-cover"
            />
          ) : post.poster && !post.poster.startsWith('/placeholders/') ? (
            <Image
              src={mediaUrl(post.poster)}
              alt={
                post.posterAlt ||
                (!client.isPlaceholder
                  ? (typeof window !== 'undefined' &&
                      process.env.NODE_ENV !== 'production' &&
                      console.warn(`[A11y Warning] Missing posterAlt for case study post: ${post.id}`),
                    `Case study reel breakdown for ${client.handle}`)
                  : `Case study reel breakdown for ${client.handle}`)
              }
              fill
              loading="lazy"
              referrerPolicy="no-referrer"
              sizes="(max-width: 1024px) 320px, 400px"
              className="object-cover"
            />
          ) : (
            <PlaceholderTile
              aspectRatio="9:16"
              label="PLACEHOLDER REEL"
              caption={client.handle}
              className="h-full w-full border-0 pointer-events-none"
            />
          )}
        </div>

        {/* Large Centered Play/Pause Button (min 56px) */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? 'Pause breakdown reel' : 'Play breakdown reel'}
            className="pointer-events-auto flex h-14 w-14 min-h-[56px] min-w-[56px] items-center justify-center bg-ink/80 text-paper border border-line-on-dark hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-paper transition-colors duration-150 cursor-pointer"
          >
            {playing ? (
              <Pause className="h-6 w-6 fill-current" aria-hidden="true" />
            ) : (
              <Play className="h-6 w-6 fill-current ml-0.5" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* CreditPill with client handle at bottom-left */}
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
          <CreditPill handle={client.handle} />
        </div>
      </div>

      {/* Scrub Bar */}
      <div className="flex flex-col gap-2">
        <div className="relative w-full py-3 flex items-center">
          {/* Base 2px paper track */}
          <div
            className="absolute left-0 right-0 h-[2px] bg-paper/30 pointer-events-none"
            aria-hidden="true"
          />

          {/* Filled active track */}
          <div
            className="absolute left-0 h-[2px] bg-paper pointer-events-none"
            style={{
              width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
            }}
            aria-hidden="true"
          />

          {/* Marker Ticks (Not yellow! Paper ticks on the track) */}
          {markers.map((m, idx) => {
            const leftPct = duration > 0 ? (m.time / duration) * 100 : 0;
            const isActive = idx === activeMarkerIndex;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onMarkerSelect(m)}
                title={`${m.label} (${formatTime(m.time)})`}
                aria-label={`Jump to marker ${m.label} at ${formatTime(m.time)}`}
                style={{ left: `${leftPct}%` }}
                className="absolute -translate-x-1/2 z-20 cursor-pointer min-h-[44px] min-w-[36px] sm:min-w-[44px] flex items-center justify-center p-0 focus-visible:outline-2 focus-visible:outline-paper"
              >
                <span
                  className={`block w-[2px] mx-auto ${
                    isActive ? 'h-4 bg-paper' : 'h-2 bg-paper/60 hover:bg-paper'
                  }`}
                />
              </button>
            );
          })}

          {/* Accessible Native Range Input */}
          <input
            type="range"
            min={0}
            max={duration || 15}
            step={0.1}
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            onKeyDown={handleKeyDown}
            aria-label="Reel timeline scrubber"
            aria-valuemin={0}
            aria-valuemax={duration || 15}
            aria-valuenow={currentTime}
            aria-valuetext={`${currentTimeFormatted} of ${durationFormatted}`}
            className="relative z-10 w-full h-8 appearance-none bg-transparent cursor-pointer focus-visible:outline-2 focus-visible:outline-paper focus-visible:outline-offset-2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-paper [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-paper [&::-moz-range-thumb]:border-0"
          />
        </div>

        {/* Controls row under the frame */}
        <div className="flex items-center justify-between border-t border-line-on-dark pt-3 text-paper">
          <div className="flex items-center gap-2">
            {/* Play/Pause Button (min 44x44px touch target) */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? 'Pause video' : 'Play video'}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center border border-line-on-dark bg-transparent text-paper hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-paper cursor-pointer transition-colors"
            >
              {playing ? (
                <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
              ) : (
                <Play className="h-4 w-4 fill-current ml-0.5" aria-hidden="true" />
              )}
            </button>

            {/* Mute/Unmute Button (Real video only) */}
            {hasVideoSrc && (
              <button
                type="button"
                onClick={onToggleMute}
                aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center border border-line-on-dark bg-transparent text-paper hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-paper cursor-pointer transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            )}
          </div>

          {/* Time text in tabular numerals */}
          <div className="font-mono text-xs tracking-wider tabular-nums text-paper/80">
            <span>{currentTimeFormatted}</span>
            <span className="mx-1 text-paper/40">/</span>
            <span>{durationFormatted}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
