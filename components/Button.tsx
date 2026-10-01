import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'onDark' | 'secondaryOnDark';
export type ButtonArrow = 'up-right' | 'right' | 'none';

export interface ButtonProps {
  variant?: ButtonVariant;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
  arrow?: ButtonArrow;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  ariaLabel?: string;
  target?: string;
  rel?: string;
}

export default function Button({
  variant = 'primary',
  href,
  onClick,
  children,
  arrow = 'none',
  className,
  type = 'button',
  disabled = false,
  ariaLabel,
  target,
  rel,
}: ButtonProps) {
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-ink text-paper border border-ink hover:bg-ink-soft hover:border-ink-soft active:bg-ink',
    secondary:
      'bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper active:bg-ink-soft',
    onDark:
      'bg-paper text-ink border border-paper hover:bg-paper-dark hover:border-paper-dark active:bg-paper',
    secondaryOnDark:
      'bg-transparent text-paper border border-paper hover:bg-paper hover:text-ink active:bg-paper-dark',
  };

  const isDarkFocus = variant === 'onDark' || variant === 'secondaryOnDark';

  const baseStyles = cn(
    'group inline-flex min-h-[48px] items-center justify-center gap-2.5 px-6 py-3 font-body text-sm font-semibold tracking-tight transition-colors duration-150 select-none cursor-pointer',
    'focus-visible:outline-2 focus-visible:outline-offset-2',
    isDarkFocus ? 'focus-visible:outline-paper' : 'focus-visible:outline-ink',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    variantStyles[variant],
    className
  );

  const ArrowIcon =
    arrow === 'up-right' ? (
      <ArrowUpRight
        className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transform-none"
        aria-hidden="true"
      />
    ) : arrow === 'right' ? (
      <ArrowRight
        className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transform-none"
        aria-hidden="true"
      />
    ) : null;

  if (href) {
    const isExternal =
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('//') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:');
    const isAnchor = href.startsWith('#');

    if (isExternal || isAnchor) {
      return (
        <a
          href={href}
          onClick={onClick}
          className={baseStyles}
          aria-label={ariaLabel}
          target={isExternal ? (target ?? '_blank') : target}
          rel={isExternal ? (rel ?? 'noopener noreferrer') : rel}
        >
          <span>{children}</span>
          {ArrowIcon}
        </a>
      );
    }

    return (
      <Link
        href={href}
        onClick={onClick}
        className={baseStyles}
        aria-label={ariaLabel}
      >
        <span>{children}</span>
        {ArrowIcon}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
      aria-label={ariaLabel}
    >
      <span>{children}</span>
      {ArrowIcon}
    </button>
  );
}
