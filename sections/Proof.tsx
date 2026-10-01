'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import Section from '@/components/Section';
import Container from '@/components/Container';
import SectionLabel from '@/components/SectionLabel';
import Hairline from '@/components/Hairline';
import Reveal from '@/components/Reveal';
import { proofItems } from '@/data/proof';
import { posts } from '@/data/posts';
import { clients } from '@/data/clients';
import { mediaUrl } from '@/lib/media';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function ProofSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasScrolledIntoView, setHasScrolledIntoView] = useState(false);
  const isReducedMotion = useReducedMotion();

  const shouldReveal = isReducedMotion || hasScrolledIntoView;

  useEffect(() => {
    if (isReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasScrolledIntoView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    const el = sectionRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [isReducedMotion]);

  // Filter posts with verified publicMetric
  const postsWithMetric = posts.filter((p) => Boolean(p.publicMetric));

  return (
    <Section
      id="proof"
      variant="paper-dark"
      ariaLabel="Proof - Straight from the chat"
      className="py-[var(--section-py)]"
    >
      <Container>
        {/* Section Heading & Intro in tight compact block */}
        <div className="flex flex-col gap-1">
          <Reveal delay={0}>
            <SectionLabel label="06 / Proof" />
          </Reveal>
          <Reveal delay={60}>
            <h2 className="font-display text-h1 sm:text-display font-extrabold tracking-tight text-ink">
              Straight from the chat.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-body text-sm sm:text-base text-ink-soft">
              What clients say, and numbers you can check on Instagram.
            </p>
          </Reveal>
        </div>

        {/* Part 1: Chats in two columns with tighter bubble padding */}
        <div ref={sectionRef} className="mt-3 sm:mt-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {proofItems.map((item) => {
              const client = clients.find((c) => c.id === item.clientId);

              return (
                <div key={item.id} className="flex flex-col">
                  {/* Handle above card */}
                  <div className="flex items-center justify-between mb-1 px-1">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                      {client ? client.handle : 'Verified Partner'}
                    </span>
                    <span className="font-mono text-[10px] text-ink-soft">
                      Direct WhatsApp
                    </span>
                  </div>

                  {item.screenshot ? (
                    <div className="relative aspect-[4/3] w-full max-h-[160px] overflow-hidden border border-line bg-paper">
                      <Image
                        src={mediaUrl(item.screenshot.src)}
                        alt={item.screenshot.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    /* Chat card with tighter bubble padding */
                    <div className="border border-line bg-paper p-3 sm:p-3.5 flex flex-col gap-2 min-h-[120px] justify-center">
                      {item.messages.map((msg, msgIdx) => {
                        const isClient = msg.from === 'client';
                        const delayMs = isReducedMotion ? 0 : msgIdx * 200;

                        return (
                          <div
                            key={msgIdx}
                            style={{
                              opacity: shouldReveal ? 1 : 0,
                              transitionProperty: 'opacity',
                              transitionDuration: isReducedMotion ? '0ms' : '200ms',
                              transitionTimingFunction: 'var(--ease-out)',
                              transitionDelay: `${delayMs}ms`,
                            }}
                            className={`flex flex-col ${
                              isClient
                                ? 'self-start text-left items-start'
                                : 'self-end text-right items-end'
                            } max-w-[88%] sm:max-w-[80%]`}
                          >
                            <div
                              className={`p-2 sm:px-2.5 sm:py-1.5 text-xs sm:text-sm font-body leading-snug rounded-[2px] ${
                                isClient
                                  ? 'bg-paper text-ink border border-line'
                                  : 'bg-ink text-paper'
                              }`}
                            >
                              {msg.text}
                            </div>
                            {msg.time && (
                              <span className="font-mono text-[9px] text-ink-soft/70 mt-0.5 px-0.5">
                                {msg.time}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="my-3 sm:my-4">
          <Hairline />
        </div>

        {/* Part 2: Metric cards in one compact row below */}
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-ink-soft">
              Numbers you can check
            </span>
          </div>

          {postsWithMetric.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {postsWithMetric.map((post) => {
                const metric = post.publicMetric!;
                return (
                  <div
                    key={post.id}
                    className="border border-line bg-paper p-3 sm:px-4 sm:py-3 flex flex-col justify-between gap-2"
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-baseline justify-between">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                          {metric.label}
                        </span>
                        <span className="font-mono text-[10px] text-ink-soft">
                          verified {metric.verifiedOn}
                        </span>
                      </div>
                      <div className="font-display text-2xl sm:text-3xl font-extrabold text-ink mt-0.5">
                        {metric.value}
                      </div>
                    </div>

                    <a
                      href={post.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs text-ink hover:text-ink-soft underline pt-1"
                    >
                      <span>Check on Instagram</span>
                      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            /* 3 placeholder boxes if no posts have publicMetric */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[0, 1, 2].map((slot) => (
                <div
                  key={slot}
                  className="placeholder-hatch border border-line p-3 flex flex-col items-center justify-center text-center bg-paper/40"
                >
                  <span className="bg-paper border border-line px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-ink-soft font-semibold">
                    PUBLIC METRIC GOES HERE
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
