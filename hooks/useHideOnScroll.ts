'use client';

import { useState, useEffect, useRef } from 'react';

export interface UseHideOnScrollOptions {
  headerRef: React.RefObject<HTMLElement | null>;
  isMenuOpen?: boolean;
}

/**
 * Mobile-only hide-on-scroll header hook.
 * Slides the header up when scrolling down >8px past 80px from top,
 * and restores it when scrolling up, within 80px of top, or when focused.
 * Also synchronizes the --header-offset CSS variable for sticky elements.
 */
export function useHideOnScroll({
  headerRef,
  isMenuOpen = false,
}: UseHideOnScrollOptions): boolean {
  const [scrollHidden, setScrollHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const hasFocus = () => {
      return Boolean(
        headerRef.current && headerRef.current.contains(document.activeElement)
      );
    };

    const handleScroll = () => {
      if (rafIdRef.current !== null) return;

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;

        const currentScrollY = window.scrollY;
        const lastScrollY = lastScrollYRef.current;
        const diff = currentScrollY - lastScrollY;

        // Always visible within 80px of page top
        if (currentScrollY <= 80) {
          setScrollHidden(false);
        }
        // Always visible when header or internal element has keyboard focus
        else if (hasFocus()) {
          setScrollHidden(false);
        }
        // Scrolling down more than 8px past the first 80px
        else if (diff > 8) {
          setScrollHidden(true);
        }
        // Scrolling up
        else if (diff < -4) {
          setScrollHidden(false);
        }

        lastScrollYRef.current = currentScrollY;
      });
    };

    const handleFocusIn = () => {
      setScrollHidden(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('focusin', handleFocusIn);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('focusin', handleFocusIn);
    };
  }, [headerRef]);

  // Derived state: Menu open forces header to stay visible
  const isHidden = isMenuOpen ? false : scrollHidden;

  // Synchronize --header-offset CSS variable
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      document.documentElement.style.setProperty('--header-offset', '80px');
      return;
    }
    const offset = isHidden ? '0px' : '64px';
    document.documentElement.style.setProperty('--header-offset', offset);
  }, [isHidden]);

  return isHidden;
}
