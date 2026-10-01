'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import Section from '@/components/Section';
import Container from '@/components/Container';
import SectionLabel from '@/components/SectionLabel';
import CreditPill from '@/components/CreditPill';
import Reveal from '@/components/Reveal';
import { managedByItems } from '@/data/managedBy';

export default function ManagedBySection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <Section
      id="managed-by"
      variant="paper-dark"
      ariaLabel="Managed by - What managed by actually means"
      className="py-[var(--section-py)]"
    >
      <Container>
        {/* Heading and credit pill on one row on desktop */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 pb-3 sm:pb-4 border-b border-line">
          <div className="flex flex-col gap-1">
            <Reveal delay={0}>
              <SectionLabel label="04 / Managed by" />
            </Reveal>
            <Reveal delay={60}>
              <h2 className="font-display text-h1 sm:text-display font-extrabold tracking-tight text-ink">
                What &ldquo;managed by&rdquo; actually means.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="font-body text-sm sm:text-base text-ink-soft">
                Five things we do so you don&apos;t have to.
              </p>
            </Reveal>
          </div>

          <div className="flex items-center gap-3 shrink-0 pt-1 lg:pt-0">
            <CreditPill size="md" />
            <span className="font-mono text-xs font-semibold text-ink-soft uppercase tracking-wider">
              Means all five
            </span>
          </div>
        </div>

        {/* Five Accordion Rows (~56px tall) */}
        <div className="flex flex-col divide-y divide-line border-b border-line">
          {managedByItems.map((item) => {
            const isOpen = openId === item.id;
            const buttonId = `managed-by-btn-${item.id}`;
            const regionId = `managed-by-desc-${item.id}`;

            return (
              <div key={item.id} className="flex flex-col">
                <h3 className="m-0 p-0 font-normal">
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => toggleRow(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={regionId}
                    className="flex min-h-[56px] h-[56px] w-full items-center justify-between text-left py-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-ink group"
                  >
                    <div className="flex items-baseline gap-4 sm:gap-6">
                      <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-ink-soft">
                        {item.number}
                      </span>
                      <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-ink group-hover:text-ink-soft transition-colors">
                        {item.verb}
                      </span>
                    </div>

                    <span className="flex h-7 w-7 items-center justify-center border border-line bg-paper text-ink shrink-0 group-hover:border-ink transition-colors">
                      {isOpen ? (
                        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </span>
                  </button>
                </h3>

                {/* Animated Description Region */}
                <div
                  id={regionId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`overflow-hidden transition-all duration-200 motion-reduce:transition-none ${
                    isOpen
                      ? 'max-h-36 opacity-100 pb-4'
                      : 'max-h-0 opacity-0 pb-0'
                  }`}
                >
                  <p className="font-body text-sm sm:text-base text-ink-soft max-w-2xl pl-8 sm:pl-12">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
