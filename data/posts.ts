import { Post } from '../types';

export const posts: Post[] = [
  {
    id: 'placeholder-post-01',
    clientId: 'placeholder-01',
    format: 'reel',
    videoSrc: undefined, // Placeholder: Real video src to be linked
    poster: '/placeholders/posts/post-01-poster.jpg',
    instagramUrl: 'https://instagram.com/p/placeholder01',
    publicMetric: {
      label: 'Plays',
      value: '1.2M',
      verifiedOn: '2025-01-15',
    },
    breakdownMarkers: [
      {
        time: 0,
        label: 'Hook',
        note: 'Macro cut of jewel setting under warm natural studio light.',
      },
      {
        time: 3,
        label: 'Craft Detail',
        note: 'Artisan handcrafting sequence synchronized to audio beat.',
      },
      {
        time: 7,
        label: 'CTA Overlay',
        note: 'Minimal caption inviting direct enquiry in DM.',
      },
    ],
  },
  {
    id: 'placeholder-post-02',
    clientId: 'placeholder-02',
    format: 'carousel',
    videoSrc: undefined,
    poster: '/placeholders/posts/post-02-poster.jpg',
    instagramUrl: 'https://instagram.com/p/placeholder02',
    publicMetric: {
      label: 'Saves',
      value: '4.8K',
      verifiedOn: '2025-02-10',
    },
    breakdownMarkers: [
      {
        time: 0,
        label: 'Cover Slide',
        note: 'Editorial lookbook headline typography with high-contrast frame.',
      },
      {
        time: 1,
        label: 'Look Breakdowns',
        note: 'Fabric swatches and styling notes per swipe.',
      },
    ],
  },
  {
    id: 'placeholder-post-03',
    clientId: 'placeholder-04',
    format: 'reel',
    videoSrc: undefined,
    poster: '/placeholders/posts/post-03-poster.jpg',
    instagramUrl: 'https://instagram.com/p/placeholder03',
    publicMetric: {
      label: 'Accounts Reached',
      value: '420K',
      verifiedOn: '2025-03-01',
    },
    breakdownMarkers: [
      {
        time: 0,
        label: 'Opening Pour',
        note: 'Cocktail shake-and-strain audio-first sensory hook.',
      },
      {
        time: 4,
        label: 'Atmosphere Beat',
        note: 'Golden hour amber glow across table setting.',
      },
      {
        time: 9,
        label: 'Weekend Booking',
        note: 'Table reservation link in bio prompt.',
      },
    ],
  },
];
