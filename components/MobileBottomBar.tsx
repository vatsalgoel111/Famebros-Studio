'use client';

import React, { useState, useEffect } from 'react';
import { siteConfig } from '@/data/site';
import { isWallEnabled } from '@/lib/wall';
import Button from './Button';
import { trackEvent } from '@/lib/analytics';

export default function MobileBottomBar() {
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    // Hide while any input or textarea has focus (e.g. keyboard open)
    const handleFocusIn = () => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        activeTag === 'select'
      ) {
        setIsInputFocused(true);
      }
    };

    const handleFocusOut = () => {
      setIsInputFocused(false);
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  const shouldHide = isInputFocused;

  const whatsappMessage = encodeURIComponent(
    "Hi Famebros, I'd like to talk about my brand's Instagram."
  );
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${whatsappMessage}`;

  return (
    <aside
      aria-label="Quick Actions"
      className={`fixed bottom-0 left-0 right-0 z-30 block md:hidden border-t border-line bg-paper px-4 py-3 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] ${
        shouldHide ? 'translate-y-full pointer-events-none' : 'translate-y-0'
      }`}
    >
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          href={isWallEnabled() ? '#wall' : '#breakdown'}
          className="w-full text-center"
          ariaLabel={isWallEnabled() ? 'Jump to The Wall' : 'Jump to The Work'}
        >
          {isWallEnabled() ? 'The Wall' : 'The Work'}
        </Button>
        <Button
          variant="primary"
          href={whatsappUrl}
          arrow="up-right"
          className="w-full text-center"
          ariaLabel="Chat on WhatsApp"
          onClick={() => trackEvent('whatsapp_click', { source: 'bottom_bar' })}
        >
          WhatsApp
        </Button>
      </div>
    </aside>
  );
}
