import React from 'react';
import Section from '@/components/Section';
import Container from '@/components/Container';
import SectionLabel from '@/components/SectionLabel';
import PlaceholderTile from '@/components/PlaceholderTile';
import FadeImage from '@/components/FadeImage';
import Reveal from '@/components/Reveal';
import { mediaUrl } from '@/lib/media';
import { crewMembers, bts } from '@/data/crew';

export default function CrewSection() {
  return (
    <Section
      id="crew"
      variant="paper"
      ariaLabel="The Bros - The people behind the posts"
      className="py-[var(--section-py)]"
    >
      <Container>
        {/* Section Heading & Intro in tight compact block */}
        <div className="flex flex-col gap-1">
          <Reveal delay={0}>
            <SectionLabel label="05 / The Bros" />
          </Reveal>
          <Reveal delay={60}>
            <h2 className="font-display text-h1 sm:text-display font-extrabold tracking-tight text-ink">
              The bros behind the posts.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-body text-sm sm:text-base text-ink-soft">
              The crew that shoots, cuts and posts.
            </p>
          </Reveal>
        </div>

        {/* Crew Grid: 4:5 portrait tiles, max-height 34dvh on desktop */}
        <div className="mt-3 sm:mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 items-start">
          {crewMembers.map((member) => {
            const hasRealPhoto = Boolean(member.photo && !member.photo.startsWith('/placeholders/'));
            const photoAlt =
              member.photoAlt ||
              (!member.isPlaceholder
                ? (typeof window !== 'undefined' &&
                    process.env.NODE_ENV !== 'production' &&
                    console.warn(`[A11y Warning] Missing photoAlt for crew member: ${member.name}`),
                  `Portrait of ${member.name}, ${member.role}`)
                : `Portrait of ${member.name}`);

            return (
              <div key={member.id} className="flex flex-col w-full">
                <div className="relative aspect-[4/5] w-full lg:max-h-[34dvh] lg:h-[30dvh] overflow-hidden border border-line bg-paper-dark">
                  {hasRealPhoto && member.photo ? (
                    <FadeImage
                      src={mediaUrl(member.photo)}
                      alt={photoAlt}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
                      className="object-cover"
                    />
                  ) : (
                    <PlaceholderTile
                      aspectRatio="4:5"
                      label="PORTRAIT"
                      className="h-full w-full border-0 pointer-events-none"
                    />
                  )}
                </div>

                <div className="mt-1 flex flex-col gap-0.5">
                  <h3 className="font-display text-sm sm:text-base font-bold tracking-tight text-ink">
                    {member.name}
                  </h3>
                  <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-ink-soft">
                    {member.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Behind-the-Scenes Strip: 3 tiles (4:3), max-height 22dvh on desktop */}
        <div className="mt-3 sm:mt-4 border-t border-line pt-2.5 sm:pt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink-soft">
              Behind The Scenes
            </span>
            <span className="font-mono text-xs text-ink-soft sm:hidden">
              Swipe &rarr;
            </span>
          </div>

          <div className="flex lg:grid lg:grid-cols-3 gap-3 sm:gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-2 lg:pb-0 -mr-4 pr-4 sm:mr-0 sm:pr-0 overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {bts.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-[240px] sm:w-[280px] lg:w-auto snap-start flex flex-col gap-1"
              >
                <div className="relative aspect-[4/3] w-full lg:max-h-[22dvh] lg:h-[18dvh] overflow-hidden border border-line bg-paper-dark">
                  {item.image && !item.image.startsWith('/placeholders/') ? (
                    <FadeImage
                      src={mediaUrl(item.image)}
                      alt={item.alt || `Behind the scenes: ${item.caption}`}
                      fill
                      sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 360px"
                      className="object-cover"
                    />
                  ) : (
                    <PlaceholderTile
                      aspectRatio="4:3"
                      label="BTS"
                      className="h-full w-full border-0 pointer-events-none"
                    />
                  )}
                </div>
                <span className="font-mono text-xs text-ink-soft truncate">
                  {item.caption}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
