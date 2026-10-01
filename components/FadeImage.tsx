'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

export default function FadeImage({
  priority,
  alt = '',
  className,
  onLoad,
  ...props
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Images marked priority must not fade (prevents delayed LCP)
  if (priority) {
    return (
      <Image
        priority
        alt={alt}
        className={className}
        onLoad={onLoad}
        referrerPolicy="no-referrer"
        {...props}
      />
    );
  }

  return (
    <Image
      alt={alt}
      className={cn(
        'transition-opacity duration-[var(--dur-base)] ease-[var(--ease-out)]',
        isLoaded ? 'opacity-100' : 'opacity-0',
        className
      )}
      onLoad={(e) => {
        setIsLoaded(true);
        onLoad?.(e);
      }}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
}
