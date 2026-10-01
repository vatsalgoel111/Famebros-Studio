import React from 'react';
import { Client } from '@/types';
import CreditPill from '@/components/CreditPill';
import PlaceholderTile from '@/components/PlaceholderTile';
import FadeImage from '@/components/FadeImage';
import { mediaUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import { WALL_DRAFT_MODE } from '@/data/site';

export interface WallTileProps {
  client: Client;
  onClick: (client: Client) => void;
  style?: React.CSSProperties;
  className?: string;
}

export default function WallTile({ client, onClick, style, className }: WallTileProps) {
  const hasRealImage =
    !client.isPlaceholder &&
    client.hasPermission &&
    Boolean(client.coverImage) &&
    !client.coverImage.startsWith('/placeholders/');

  const altText =
    client.coverAlt ||
    (hasRealImage
      ? (typeof window !== 'undefined' &&
          process.env.NODE_ENV !== 'production' &&
          console.warn(`[A11y Warning] Missing coverAlt for client: ${client.handle}`),
        `Instagram feed cover for ${client.displayName || client.handle}`)
      : `Cover preview for ${client.displayName || client.handle}`);

  const accessibleName = `${client.displayName || client.handle}, ${client.industry}. Opens details.`;

  return (
    <button
      type="button"
      onClick={() => onClick(client)}
      aria-label={accessibleName}
      style={style}
      className={cn(
        'group relative flex w-full aspect-[3/4] flex-col overflow-hidden border border-line bg-paper text-left transition-colors duration-[var(--dur-fast)] cursor-pointer',
        'hover:border-ink focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2',
        className
      )}
    >
      {/* Draft Mode Badge (only renders when WALL_DRAFT_MODE is true and client has no permission) */}
      {WALL_DRAFT_MODE && !client.hasPermission && (
        <span className="absolute top-2 left-2 z-20 bg-ink text-paper font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 select-none pointer-events-none">
          DRAFT: no permission yet
        </span>
      )}

      {/* Visual Media Layer */}
      <div className="relative flex-1 w-full overflow-hidden bg-paper-dark">
        {hasRealImage ? (
          <FadeImage
            src={mediaUrl(client.coverImage)}
            alt={altText}
            fill
            sizes="(max-width: 360px) 50vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1440px) 17vw, 160px"
            loading="lazy"
            className="object-cover"
          />
        ) : (
          <PlaceholderTile
            aspectRatio="3:4"
            label="PLACEHOLDER"
            className="h-full w-full border-0 pointer-events-none"
          />
        )}
      </div>

      {/* Solid Ink Bottom Strip */}
      <div className="flex min-h-[36px] sm:min-h-[40px] items-center justify-between gap-1.5 border-t border-line-on-dark bg-ink px-2 py-1.5 sm:px-2.5 sm:py-2 z-10 shrink-0">
        <span data-handle="true" className="truncate font-mono text-[10px] sm:text-xs font-medium text-paper">
          {client.handle}
        </span>
        <CreditPill compact />
      </div>
    </button>
  );
}
