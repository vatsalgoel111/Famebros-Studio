import { SiteConfig } from '../types';
import { getLiveClients } from './clients';

export const siteConfig: SiteConfig = {
  name: 'Famebros Studio',
  instagram: '@famebrosstudio',
  city: 'Mumbai',
  whatsappNumber: '91XXXXXXXXXX',
  email: 'hello@famebrosstudio.com',
  // since: 2022, // CONFIRM: earliest public post seen is 3 Nov 2022
};

// Re-export getLiveClients helper so any module can import it from site or clients.
// Any client count shown on the site must come from getLiveClients().length. Never hardcode a number.
export { getLiveClients };

// Temporary style guide toggle (shows style guide section on home page when true)
export const SHOW_STYLEGUIDE = false;

// Content pipeline status panel toggle
// Set to false before launch.
export const SHOW_CONTENT_STATUS = false;

// Wall draft mode toggle: when true, all non-placeholder clients are visible on the Wall
// even without permission (marked with draft badges).
// Set to false before launch.
export const WALL_DRAFT_MODE = true;

// Analytics tracking toggle. Set true and add a real provider before launch if wanted.
export const ANALYTICS_ENABLED = false;
