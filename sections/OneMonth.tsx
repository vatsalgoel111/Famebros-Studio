'use client';

import React, { useState, useMemo } from 'react';
import Section from '@/components/Section';
import Container from '@/components/Container';
import SectionLabel from '@/components/SectionLabel';
import PlaceholderTile from '@/components/PlaceholderTile';
import FadeImage from '@/components/FadeImage';
import Hairline from '@/components/Hairline';
import Reveal from '@/components/Reveal';
import { placeholderMonthPlan } from '@/data/oneMonth';
import { posts } from '@/data/posts';
import { CalendarDay, CalendarItem } from '@/types';
import { mediaUrl } from '@/lib/media';
import { ArrowUpRight } from 'lucide-react';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function OneMonthSection() {
  const plan = placeholderMonthPlan;

  // Map dates to their CalendarDay
  const daysMap = useMemo(() => {
    const map = new Map<number, CalendarDay>();
    plan.days.forEach((day) => {
      map.set(day.date, day);
    });
    return map;
  }, [plan]);

  // Find first day with items to select by default
  const initialDate = useMemo(() => {
    const first = plan.days.find((d) => d.items.length > 0);
    return first ? first.date : 1;
  }, [plan]);

  const [selectedDate, setSelectedDate] = useState<number>(initialDate);

  const selectedDay = daysMap.get(selectedDate);

  // Total posts calculation
  const totalPosts = useMemo(() => {
    return plan.days.reduce((acc, d) => acc + d.items.length, 0);
  }, [plan]);

  const renderDayDetail = () => {
    if (!selectedDay || selectedDay.items.length === 0) {
      return (
        <div className="border border-line bg-paper-dark/30 p-6 text-center">
          <p className="font-mono text-xs text-ink-soft">
            No scheduled posts for Day {selectedDate}.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between border-b border-line pb-3">
          <h3 className="font-display text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
            Day {selectedDay.date} Breakdown
          </h3>
          <span className="font-mono text-xs text-ink-soft">
            {selectedDay.items.length}{' '}
            {selectedDay.items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="flex flex-col gap-6">
          {selectedDay.items.map((item: CalendarItem, idx: number) => {
            const ratio =
              item.kind === 'reel' || item.kind === 'story' ? '9:16' : '4:5';
            const linkedPost = item.postId
              ? posts.find((p) => p.id === item.postId)
              : null;

            return (
              <div
                key={idx}
                className="border border-line bg-paper-dark/20 p-4 sm:p-5 flex flex-col gap-4"
              >
                {/* Header with Kind badge & Title */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="inline-block w-fit font-mono text-[10px] font-bold uppercase tracking-wider bg-ink text-paper px-2 py-0.5">
                      {item.kind}
                    </span>
                    <h4 className="font-display text-base font-bold text-ink mt-1">
                      {item.title}
                    </h4>
                  </div>

                  {linkedPost?.instagramUrl && (
                    <a
                      href={linkedPost.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs text-ink hover:text-ink-soft underline shrink-0"
                    >
                      <span>Open on Instagram</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Thumbnail */}
                  <div className="w-24 sm:w-28 shrink-0">
                    {linkedPost?.poster && !linkedPost.poster.startsWith('/placeholders/') ? (
                      <div className="relative aspect-[9/16] w-full overflow-hidden border border-line bg-paper-dark">
                        <FadeImage
                          src={mediaUrl(linkedPost.poster)}
                          alt={linkedPost.posterAlt || item.title}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <PlaceholderTile
                        aspectRatio={ratio}
                        label={item.kind.toUpperCase()}
                        className="border border-line"
                      />
                    )}
                  </div>

                  {/* "Why this exists" block with four short labelled lines in order */}
                  <div className="flex-1 w-full flex flex-col gap-2.5 bg-paper p-3.5 border border-line">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink-soft">
                      Why this exists
                    </span>

                    <div className="flex flex-col gap-1.5 font-body text-xs text-ink divide-y divide-line/40">
                      <div className="pt-1 first:pt-0">
                        <span className="font-mono font-semibold text-ink-soft mr-2 uppercase tracking-wide">
                          Hook:
                        </span>
                        <span>{item.why.hook}</span>
                      </div>
                      <div className="pt-1.5">
                        <span className="font-mono font-semibold text-ink-soft mr-2 uppercase tracking-wide">
                          Audience:
                        </span>
                        <span>{item.why.audience}</span>
                      </div>
                      <div className="pt-1.5">
                        <span className="font-mono font-semibold text-ink-soft mr-2 uppercase tracking-wide">
                          Format:
                        </span>
                        <span>{item.why.format}</span>
                      </div>
                      <div className="pt-1.5">
                        <span className="font-mono font-semibold text-ink-soft mr-2 uppercase tracking-wide">
                          Call to action:
                        </span>
                        <span>{item.why.cta}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Section
      id="one-month"
      variant="paper"
      ariaLabel="One Month - What a month looks like"
      className="py-[var(--section-py)]"
    >
      <Container>
        {/* Section Heading & Intro in tight compact block */}
        <div className="flex flex-col gap-1">
          <Reveal delay={0}>
            <SectionLabel label="03 / One Month" />
          </Reveal>
          <Reveal delay={60}>
            <h2 className="font-display text-h1 sm:text-display font-extrabold tracking-tight text-ink">
              What a month looks like.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-body text-sm sm:text-base text-ink-soft">
              One client&apos;s content calendar. Tap a day to see why it exists.
            </p>
          </Reveal>
        </div>

        {/* Month Label & Legend */}
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-ink">
            {plan.monthLabel}
          </span>

          {/* Marker Legend (Ink squares, NO color) */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono text-ink-soft">
            <span className="font-bold text-ink">Legend:</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center bg-ink text-paper text-[10px] font-bold">
                R
              </span>
              Reel
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center bg-ink text-paper text-[10px] font-bold">
                C
              </span>
              Carousel
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center bg-ink text-paper text-[10px] font-bold">
                P
              </span>
              Photo
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center bg-ink text-paper text-[10px] font-bold">
                S
              </span>
              Story
            </span>
          </div>
        </div>

        {/* 2-Column Desktop Layout (Calendar on left 7 cols, Day Detail on right 5 cols from 768px) */}
        <div className="mt-3 sm:mt-4 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-10 items-start">
          {/* Calendar Grid Container */}
          <div className="md:col-span-7 flex flex-col gap-3">
            {/* Weekday Header */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
              {WEEKDAYS.map((wd) => (
                <div
                  key={wd}
                  className="font-mono text-xs font-bold uppercase tracking-wider text-ink-soft py-0.5"
                >
                  {wd}
                </div>
              ))}
            </div>

            {/* 7-Column Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {/* Empty leading offset cells */}
              {Array.from({ length: plan.startWeekday }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="min-h-[44px] sm:min-h-[50px] border border-line/20 bg-paper-dark/10"
                  aria-hidden="true"
                />
              ))}

              {/* Month Days */}
              {Array.from({ length: plan.daysInMonth }, (_, i) => i + 1).map(
                (date) => {
                  const dayData = daysMap.get(date);
                  const hasItems = dayData && dayData.items.length > 0;
                  const isSelected = selectedDate === date;

                  if (!hasItems) {
                    return (
                      <div
                        key={date}
                        className="flex min-h-[44px] sm:min-h-[50px] flex-col p-1 sm:p-1.5 border border-line/30 bg-paper-dark/20 text-ink-soft/40 opacity-40 select-none cursor-not-allowed"
                        aria-hidden="true"
                      >
                        <span className="font-mono text-xs">{date}</span>
                      </div>
                    );
                  }

                  const accessibleLabel = `Day ${date}, ${dayData.items.length} ${
                    dayData.items.length === 1 ? 'post' : 'posts'
                  }: ${dayData.items.map((it) => it.kind).join(', ')}`;

                  return (
                    <button
                      key={date}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      aria-pressed={isSelected}
                      aria-label={accessibleLabel}
                      className={`flex min-h-[44px] sm:min-h-[50px] flex-col justify-between p-1 sm:p-1.5 text-left border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-ink ${
                        isSelected
                          ? 'border-2 border-ink bg-paper-dark'
                          : 'border-line bg-paper hover:border-ink hover:bg-paper-dark/40'
                      }`}
                    >
                      <span className="font-mono text-xs sm:text-sm font-bold text-ink">
                        {date}
                      </span>

                      {/* Kind markers in small ink squares (letters: R, C, P, S) */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {dayData.items.map((item, itemIdx) => (
                          <span
                            key={itemIdx}
                            className="flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center bg-ink text-paper text-[8px] sm:text-[9px] font-mono font-bold leading-none select-none"
                            title={item.kind}
                          >
                            {item.kind.charAt(0).toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                }
              )}
            </div>

            {/* Stats line below the calendar (ONLY when not placeholder) */}
            {!plan.isPlaceholder && (
              <div className="font-mono text-xs font-semibold text-ink uppercase tracking-wider pt-2">
                {totalPosts} {totalPosts === 1 ? 'post' : 'posts'} this month
              </div>
            )}
          </div>

          {/* Desktop Right Column: Day Detail (from md:) */}
          <div className="hidden md:block md:col-span-5 border-l border-line pl-6 lg:pl-8">
            {renderDayDetail()}
          </div>
        </div>

        {/* Mobile Inline Day Detail (rendered below calendar on mobile < md:) */}
        <div className="block md:hidden mt-8 border-t border-line pt-8">
          {renderDayDetail()}
        </div>
      </Container>
    </Section>
  );
}
