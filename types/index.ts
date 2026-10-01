export type Industry =
  | 'jewellery'
  | 'fashion'
  | 'hospitality'
  | 'retail'
  | 'other';

export interface Client {
  id: string;
  handle: string; // Instagram handle e.g. "@placeholder_01"
  displayName: string;
  industry: Industry;
  city: string;
  coverImage: string;
  coverAlt?: string; // Optional accessible description for cover image
  servicesWeRun: string[];
  hasPermission: boolean;
  isPlaceholder: boolean;
}

export type PostFormat = 'reel' | 'carousel' | 'photo';

export interface PublicMetric {
  label: string;
  value: string;
  verifiedOn: string;
}

export interface BreakdownMarker {
  time: number; // timestamp in seconds
  label: string;
  note: string;
}

export interface Post {
  id: string;
  clientId: string;
  format: PostFormat;
  videoSrc?: string;
  poster: string;
  posterAlt?: string; // Optional accessible description for post poster
  durationSeconds?: number; // Optional duration of reel/video in seconds
  instagramUrl: string;
  publicMetric?: PublicMetric;
  breakdownMarkers?: BreakdownMarker[];
}

export interface SiteConfig {
  name: string;
  instagram: string;
  city: string;
  whatsappNumber: string;
  email: string;
  since?: number;
}

export interface CaseStudy {
  id: string;
  clientId: string;
  postId: string;
  title: string;
  whatWeDid: string[];
  whyItWorked: string[];
  isPlaceholder: boolean;
}

export type PostKind = 'reel' | 'carousel' | 'photo' | 'story';

export interface CalendarItem {
  kind: PostKind;
  title: string;
  postId?: string;
  why: {
    hook: string;
    audience: string;
    format: string;
    cta: string;
  };
}

export interface CalendarDay {
  date: number;
  items: CalendarItem[];
}

export interface MonthPlan {
  clientId: string;
  monthLabel: string;
  startWeekday: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Monday
  daysInMonth: number;
  days: CalendarDay[];
  isPlaceholder: boolean;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
  photoAlt?: string; // Optional accessible description for portrait
  isPlaceholder: boolean;
}

export interface BehindTheScenesItem {
  id: string;
  image?: string;
  alt?: string; // Optional accessible description for BTS media
  caption: string;
}

export interface ChatMessage {
  from: 'client' | 'famebros';
  text: string;
  time?: string;
}

export interface ProofItem {
  id: string;
  clientId?: string;
  messages: ChatMessage[];
  screenshot?: {
    src: string;
    alt: string;
  };
  hasPermission?: boolean; // Default treated as false if omitted
  isPlaceholder: boolean;
}

export interface HeroClip {
  id: string;
  clientId?: string;
  videoSrc?: string;
  poster?: string;
  posterAlt?: string; // Optional accessible description for hero poster
  handle?: string;
  captionEnding: string;
  captionEndingNamed?: string;
  isPlaceholder: boolean;
}
