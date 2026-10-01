import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionLabelProps {
  label: string;
  dark?: boolean;
  className?: string;
}

export default function SectionLabel({
  label,
  dark = false,
  className,
}: SectionLabelProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 text-label font-semibold',
        dark ? 'text-paper-dark/70' : 'text-ink-soft',
        className
      )}
    >
      <span
        className={cn(
          'h-[1px] w-6 shrink-0',
          dark ? 'bg-paper/40' : 'bg-ink/30'
        )}
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}
