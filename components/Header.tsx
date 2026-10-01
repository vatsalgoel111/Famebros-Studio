'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '@/data/site';
import { useHideOnScroll } from '@/hooks/useHideOnScroll';
import { cn } from '@/lib/utils';
import { isWallEnabled } from '@/lib/wall';
import Container from './Container';
import Button from './Button';
import { trackEvent } from '@/lib/analytics';

const NAV_LINKS = [
  { label: 'Wall', href: '#wall' },
  { label: 'Work', href: '#breakdown' },
  { label: 'Process', href: '#managed-by' },
  { label: 'Crew', href: '#crew' },
  { label: 'Contact', href: '#your-tile' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const isHidden = useHideOnScroll({ headerRef, isMenuOpen: mobileMenuOpen });

  const navLinks = isWallEnabled()
    ? NAV_LINKS
    : NAV_LINKS.filter((link) => link.href !== '#wall');

  const whatsappMessage = encodeURIComponent(
    "Hi Famebros, I'd like to talk about my brand's Instagram."
  );
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${whatsappMessage}`;

  // Keyboard accessibility, focus trap, and iOS-safe body scroll lock (no page jump)
  useEffect(() => {
    if (mobileMenuOpen) {
      const triggerEl = menuTriggerRef.current;
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      const focusTimer = setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
          return;
        }

        if (e.key === 'Tab' && mobileMenuRef.current) {
          const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(focusTimer);
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
        window.removeEventListener('keydown', handleKeyDown);
        triggerEl?.focus();
      };
    }
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 z-40 w-full border-b border-line bg-paper pt-safe pl-[max(0rem,env(safe-area-inset-left))] pr-[max(0rem,env(safe-area-inset-right))] transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)]',
        isHidden ? 'max-md:-translate-y-full' : 'max-md:translate-y-0',
        'md:translate-y-0'
      )}
    >
      <Container>
        <div className="flex h-[var(--header-h)] items-center justify-between">
          {/* Wordmark */}
          <Link
            href="/"
            onClick={closeMenu}
            className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-ink transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-ink select-none"
          >
            FAMEBROS
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-8"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body text-sm font-semibold tracking-tight text-ink hover:text-ink-soft transition-colors focus-visible:outline-2 focus-visible:outline-ink py-2"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop WhatsApp CTA */}
          <div className="hidden md:flex items-center">
            <Button
              variant="primary"
              href={whatsappUrl}
              arrow="up-right"
              ariaLabel="Chat on WhatsApp"
              onClick={() => trackEvent('whatsapp_click', { source: 'header' })}
            >
              WhatsApp
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              ref={menuTriggerRef}
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-dialog"
              aria-label="Open main menu"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center border border-line bg-paper text-ink focus-visible:outline-2 focus-visible:outline-ink cursor-pointer"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Container>

      {/* Full-screen Mobile Menu with overscroll containment and internal scroll */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-nav-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-50 flex flex-col bg-paper pt-safe pb-safe px-4 sm:px-8 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] overflow-y-auto overscroll-contain animate-in fade-in duration-150"
        >
          {/* Mobile Menu Top Bar */}
          <div className="flex h-16 sm:h-20 items-center justify-between border-b border-line shrink-0">
            <Link
              href="/"
              onClick={closeMenu}
              className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-ink select-none"
            >
              FAMEBROS
            </Link>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center border border-line bg-paper text-ink focus-visible:outline-2 focus-visible:outline-ink cursor-pointer"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Mobile Menu Links */}
          <nav
            aria-label="Mobile Navigation"
            className="flex flex-1 flex-col justify-center gap-6 py-8 min-h-[300px]"
          >
            {navLinks.map((link, idx) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-ink hover:text-ink-soft focus-visible:outline-2 focus-visible:outline-ink"
              >
                <span className="font-mono text-sm font-normal text-ink-soft mr-4">
                  0{idx + 1}
                </span>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile WhatsApp Button */}
          <div className="pb-6 shrink-0">
            <Button
              variant="primary"
              href={whatsappUrl}
              arrow="up-right"
              className="w-full justify-center"
              onClick={() => {
                trackEvent('whatsapp_click', { source: 'header_menu' });
                closeMenu();
              }}
            >
              WhatsApp Us
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
