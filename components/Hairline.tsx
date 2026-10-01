import React from 'react';
import { cn } from '@/lib/utils';

export interface HairlineProps {
  dark?: boolean;
  className?: string;
}

export default function Hairline({ dark = false, className }: HairlineProps) {
  return (
    <hr
      className={cn(
        'w-full border-0 border-t',
        dark ? 'border-line-on-dark' : 'border-line',
        className
      )}
      aria-hidden="true"
    />
  );
}
