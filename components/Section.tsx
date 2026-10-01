import React from 'react';
import { cn } from '@/lib/utils';

export type SectionTheme = 'paper' | 'paper-dark' | 'ink';

export interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  variant?: SectionTheme;
  ariaLabel?: string;
  noPadding?: boolean;
}

export default function Section({
  id,
  children,
  className,
  dark = false,
  variant,
  ariaLabel,
  noPadding = false,
}: SectionProps) {
  // Determine active theme
  const activeVariant: SectionTheme =
    variant || (dark ? 'ink' : 'paper');
  const isDark = activeVariant === 'ink';

  const themeClasses: Record<SectionTheme, string> = {
    paper: 'bg-paper text-ink',
    'paper-dark': 'bg-paper-dark text-ink',
    ink: 'bg-ink text-paper',
  };

  return (
    <section
      id={id}
      aria-label={ariaLabel || id}
      data-theme={isDark ? 'dark' : 'light'}
      className={cn(
        'w-full scroll-mt-[var(--header-h)] transition-colors',
        themeClasses[activeVariant],
        !noPadding && 'py-[var(--section-py)]',
        className
      )}
    >
      {children}
    </section>
  );
}
