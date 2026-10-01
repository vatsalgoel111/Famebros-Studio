import { Client } from '../types';

export const clients: Client[] = [
  {
    id: 'anjimaxuofficially',
    handle: '@anjimaxuofficially',
    displayName: 'Anjali Arora',
    industry: 'other',
    city: 'Mumbai',
    coverImage: '/placeholders/clients/01.jpg',
    servicesWeRun: ['Reels Production', 'Celebrity Event Coverage'],
    hasPermission: false, // CONFIRM written OK to name, then set hasPermission true
    isPlaceholder: false,
  },
  {
    id: 's-bilal24',
    handle: '@s_bilal24',
    displayName: 'S Bilal',
    industry: 'other',
    city: 'Mumbai',
    coverImage: '/placeholders/clients/02.jpg',
    servicesWeRun: ['Creator Collabs', 'Reels Production'],
    hasPermission: false, // CONFIRM written OK to name, then set hasPermission true
    isPlaceholder: false,
  },
  {
    id: 'riya-kishanchandani',
    handle: '@riya_kishanchandani',
    displayName: 'Riya Kishanchandani',
    industry: 'other',
    city: 'Mumbai',
    coverImage: '/placeholders/clients/03.jpg',
    servicesWeRun: ['Candid Shoots', 'Reels Production'],
    hasPermission: false, // CONFIRM written OK to name, then set hasPermission true
    isPlaceholder: false,
  },
  {
    id: 'poonampandeyreal',
    handle: '@poonampandeyreal',
    displayName: 'Poonam Pandey',
    industry: 'other',
    city: 'Mumbai',
    coverImage: '/placeholders/clients/04.jpg',
    servicesWeRun: ['Candid Shoots', 'Content Production'],
    hasPermission: false, // CONFIRM written OK to name, then set hasPermission true
    isPlaceholder: false,
  },
  {
    id: 'placeholder-01',
    handle: '@placeholder_01',
    displayName: 'Placeholder Jewellery Maison',
    industry: 'jewellery',
    city: 'Mumbai',
    coverImage: '/placeholders/clients/01.jpg',
    servicesWeRun: ['Content Strategy', 'Reels Production', 'Community Management'],
    hasPermission: false,
    isPlaceholder: true,
  },
  {
    id: 'placeholder-02',
    handle: '@placeholder_02',
    displayName: 'Placeholder Pret Studio',
    industry: 'fashion',
    city: 'Mumbai',
    coverImage: '/placeholders/clients/02.jpg',
    servicesWeRun: ['Creative Direction', 'Lookbook Shoots', 'Paid Social'],
    hasPermission: false,
    isPlaceholder: true,
  },
  {
    id: 'placeholder-04',
    handle: '@placeholder_04',
    displayName: 'Placeholder Cocktail Bar & Kitchen',
    industry: 'hospitality',
    city: 'Mumbai',
    coverImage: '/placeholders/clients/04.jpg',
    servicesWeRun: ['Menu Drops', 'Reels Content', 'Influencer Seeding'],
    hasPermission: false,
    isPlaceholder: true,
  },
];

/**
 * Returns only verified clients who have granted publishing permission
 * and are non-placeholder accounts. Any client count shown on the site
 * must come from this helper's length. Never hardcode a number.
 */
export function getLiveClients(): Client[] {
  return clients.filter(
    (client) => client.hasPermission === true && client.isPlaceholder === false
  );
}
