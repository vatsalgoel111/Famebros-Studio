'use client';

import React, { useState, useRef, useMemo } from 'react';
import Section from '@/components/Section';
import Container from '@/components/Container';
import SectionLabel from '@/components/SectionLabel';
import Highlight from '@/components/Highlight';
import Button from '@/components/Button';
import BreakdownPlayer from '@/components/BreakdownPlayer';
import Reveal from '@/components/Reveal';
import { caseStudies, fallbackBreakdownMarkers } from '@/data/caseStudies';
import { posts } from '@/data/posts';
import { clients } from '@/data/clients';
import { siteConfig } from '@/data/site';
import { useTimeline } from '@/hooks/useTimeline';
import { BreakdownMarker } from '@/types';
import { ArrowUpRight } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

function formatMarkerTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export default function BreakdownSection() {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentCase = caseStudies[selectedCaseIndex] || caseStudies[0];
  const currentPost =
    posts.find((p) => p.id === currentCase.postId) || posts[0];
  const currentClient =
    clients.find((c) => c.id === currentCase.clientId) || clients[0];

  // Markers from post or fallback
  const markers = useMemo(() => {
    if (
      currentPost.breakdownMarkers &&
      currentPost.breakdownMarkers.length > 0
    ) {
      return [...currentPost.breakdownMarkers].sort((a, b) => a.time - b.time);
    }
    return fallbackBreakdownMarkers;
  }, [currentPost]);

  const timeline = useTimeline({
    videoRef,
    duration: 15,
    lockId: 'breakdown-timeline',
  });

  const { currentTime, seek, play, pause } = timeline;

  // Active marker is the highest timestamp <= currentTime
  const activeMarkerIndex = useMemo(() => {
    let index = 0;
    for (let i = 0; i < markers.length; i++) {
      if (currentTime >= markers[i].time) {
        index = i;
      }
    }
    return index;
  }, [currentTime, markers]);

  // Handle case switch: pause and reset time to 0
  const handleCaseSelect = (idx: number) => {
    if (idx === selectedCaseIndex) return;
    pause();
    seek(0);
    setSelectedCaseIndex(idx);
    trackEvent('breakdown_case_switch', { caseIndex: String(idx + 1) });
  };

  // Jump to marker and start playback
  const handleMarkerClick = (marker: BreakdownMarker) => {
    seek(marker.time);
    play();
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Famebros, I saw your case study for ${currentClient.handle} and want a breakdown like this for my brand.`
  );
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${whatsappMessage}`;

  return (
    <Section
      id="breakdown"
      variant="ink"
      dark
      ariaLabel="The Breakdown - Why it worked, frame by frame"
      className="py-[var(--section-py)]"
    >
      <Container>
        {/* Section Heading & Intro in tight compact block */}
        <div className="flex flex-col gap-1">
          <Reveal delay={0}>
            <SectionLabel label="02 / The Breakdown" dark />
          </Reveal>
          <Reveal delay={60}>
            <h2 className="font-display text-h1 sm:text-display font-extrabold tracking-tight text-paper">
              Why it worked, frame by frame.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-body text-sm sm:text-base text-paper/70">
              Real posts, with the thinking marked on the timeline.
            </p>
          </Reveal>
        </div>

        {/* Two-Column Responsive Layout: Reel on left, Breakdown on right */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-10 items-start">
          {/* Left Column: Height-constrained Reel Player */}
          <div className="md:col-span-5 flex justify-center items-start">
            <BreakdownPlayer
              post={currentPost}
              client={currentClient}
              markers={markers}
              activeMarkerIndex={activeMarkerIndex}
              onMarkerSelect={handleMarkerClick}
              timeline={timeline}
              videoRef={videoRef}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted(!isMuted)}
            />
          </div>

          {/* Right Column: Compact breakdown studio */}
          <div className="md:col-span-7 flex flex-col gap-3.5 text-paper">
            {/* Inline Case Selector & Case Title */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-on-dark pb-2.5">
              <div>
                <span className="font-mono text-[11px] text-paper/60 uppercase tracking-widest block">
                  Case 0{selectedCaseIndex + 1} &bull; {currentClient.industry}
                </span>
                <h3 className="font-display text-base sm:text-lg font-extrabold text-paper tracking-tight">
                  {currentCase.title}
                </h3>
              </div>

              {/* Inline Case Study Switcher */}
              <div className="flex items-center gap-1.5 shrink-0">
                {caseStudies.map((study, idx) => {
                  const studyClient =
                    clients.find((c) => c.id === study.clientId) || clients[idx];
                  const isSelected = idx === selectedCaseIndex;

                  return (
                    <button
                      key={study.id}
                      type="button"
                      onClick={() => handleCaseSelect(idx)}
                      aria-pressed={isSelected}
                      title={studyClient.handle}
                      className={`flex items-center gap-1.5 h-8 px-2.5 text-xs font-mono font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-paper bg-paper text-ink'
                          : 'border-line-on-dark bg-transparent text-paper/70 hover:border-paper hover:text-paper'
                      }`}
                    >
                      <span>0{idx + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Marker List (One line each, only active expands) */}
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] text-paper/60 uppercase tracking-widest">
                Timestamp Markers (Tap to inspect beat)
              </span>

              <div className="flex flex-col border border-line-on-dark divide-y divide-line-on-dark">
                {markers.map((m, idx) => {
                  const isActive = idx === activeMarkerIndex;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleMarkerClick(m)}
                      aria-current={isActive ? 'step' : undefined}
                      className={`flex flex-col text-left transition-colors cursor-pointer p-2 sm:px-3 ${
                        isActive
                          ? 'bg-paper/10'
                          : 'bg-transparent hover:bg-paper/5'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs tabular-nums text-paper/70 font-semibold shrink-0">
                            {formatMarkerTime(m.time)}
                          </span>

                          <span className="font-display text-sm font-bold text-paper">
                            {isActive ? (
                              <Highlight>{m.label}</Highlight>
                            ) : (
                              <span>{m.label}</span>
                            )}
                          </span>
                        </div>

                        {isActive && (
                          <span className="font-mono text-[10px] uppercase tracking-wider text-signal">
                            Active
                          </span>
                        )}
                      </div>

                      {/* Only active row expands note */}
                      {isActive && (
                        <p className="font-body text-xs text-paper/85 pl-8 pt-1 animate-in fade-in duration-150">
                          {m.note}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Three Blocks: What We Did / Why It Worked / The Number laid out compactly in a 3-column subgrid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border border-line-on-dark bg-paper/5 p-3">
              {/* 1. What We Did */}
              <div className="flex flex-col gap-1">
                <h4 className="font-mono text-[11px] uppercase tracking-widest font-bold text-paper/70">
                  What We Did
                </h4>
                <ul className="flex flex-col gap-1 pt-0.5">
                  {currentCase.whatWeDid.map((item, i) => (
                    <li
                      key={i}
                      className="font-body text-xs text-paper/90 flex items-start gap-1.5"
                    >
                      <span className="h-1 w-1 bg-paper/60 mt-1.5 shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. Why It Worked */}
              <div className="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-line-on-dark pt-2 md:pt-0 md:pl-3">
                <h4 className="font-mono text-[11px] uppercase tracking-widest font-bold text-paper/70">
                  Why It Worked
                </h4>
                <div className="font-body text-xs text-paper/80 space-y-1 pt-0.5">
                  {currentCase.whyItWorked.map((reason, i) => (
                    <p key={i}>{reason}</p>
                  ))}
                </div>
              </div>

              {/* 3. The Number */}
              <div className="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-line-on-dark pt-2 md:pt-0 md:pl-3 justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-paper/60">
                    {currentPost.publicMetric ? currentPost.publicMetric.label : 'Metric'}
                  </span>
                  <div className="font-display font-display-condensed text-2xl font-extrabold text-paper">
                    {currentPost.publicMetric ? currentPost.publicMetric.value : 'Verified'}
                  </div>
                  {currentPost.publicMetric && (
                    <span className="font-mono text-[10px] text-paper/50">
                      {currentPost.publicMetric.verifiedOn}
                    </span>
                  )}
                </div>

                {currentPost.instagramUrl && (
                  <a
                    href={currentPost.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-paper hover:text-signal underline pt-1"
                  >
                    <span>Check post</span>
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>

            {/* Action CTA: Smaller, compact button */}
            <div className="pt-1">
              <Button
                variant="onDark"
                href={whatsappUrl}
                arrow="up-right"
                className="text-xs py-2 px-3.5 min-h-[38px] w-full sm:w-auto"
                onClick={() => trackEvent('whatsapp_click', { source: 'breakdown' })}
              >
                Want a breakdown like this?
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
