import { ANALYTICS_ENABLED } from '@/data/site';

/**
 * Lightweight privacy-preserving analytics dispatch.
 * No-ops when ANALYTICS_ENABLED is false.
 * Logs events to console only in development mode.
 * Never passes personal data or user identifiers.
 */
export function trackEvent(name: string, props?: Record<string, string>): void {
  if (!ANALYTICS_ENABLED) {
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Analytics Event] ${name}`, props);
  }
}
