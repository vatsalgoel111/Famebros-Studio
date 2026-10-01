import React from 'react';
import { cn } from '@/lib/utils';

export type AspectRatioType = '9:16' | '4:5' | '1:1' | '3:4' | '4:3';

export interface PlaceholderTileProps {
  aspectRatio?: AspectRatioType;
  label?: string;
  className?: string;
  caption?: string;
}

export default function PlaceholderTile({
  aspectRatio = '9:16',
  label,
  className,
  caption,
}: PlaceholderTileProps) {
  const aspectClasses: Record<AspectRatioType, string> = {
    '9:16': 'aspect-[9/16]',
    '4:5': 'aspect-[4/5]',
    '1:1': 'aspect-square',
    '3:4': 'aspect-[3/4]',
    '4:3': 'aspect-[4/3]',
  };

  const displayLabel = label || `PLACEHOLDER ${aspectRatio}`;

  return (
    <div
      role="img"
      aria-label={displayLabel}
      className={cn(
        'relative flex w-full flex-col items-center justify-center overflow-hidden border border-line placeholder-hatch p-4 text-center select-none',
        aspectClasses[aspectRatio],
        className
      )}
    >
      <div className="z-10 inline-flex flex-col items-center gap-1.5 border border-line bg-paper px-3 py-1.5 shadow-none">
        <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-ink-soft">
          {displayLabel}
        </span>
        {caption && (
          <span className="font-body text-[10px] text-ink-soft/80">
            {caption}
          </span>
        )}
      </div>
    </div>
  );
}
