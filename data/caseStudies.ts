import { CaseStudy, BreakdownMarker } from '@/types';

export const fallbackBreakdownMarkers: BreakdownMarker[] = [
  {
    time: 0,
    label: 'The hook',
    note: 'PLACEHOLDER: explain this moment',
  },
  {
    time: 3,
    label: 'The reveal',
    note: 'PLACEHOLDER: explain this moment',
  },
  {
    time: 12,
    label: 'The ask',
    note: 'PLACEHOLDER: explain this moment',
  },
];

export const caseStudies: CaseStudy[] = [
  {
    id: 'case-01',
    clientId: 'placeholder-01',
    postId: 'placeholder-post-01',
    title: 'Placeholder case 01',
    whatWeDid: ['PLACEHOLDER: what we did'],
    whyItWorked: ['PLACEHOLDER: why it worked'],
    isPlaceholder: true,
  },
  {
    id: 'case-02',
    clientId: 'placeholder-02',
    postId: 'placeholder-post-02',
    title: 'Placeholder case 02',
    whatWeDid: ['PLACEHOLDER: what we did'],
    whyItWorked: ['PLACEHOLDER: why it worked'],
    isPlaceholder: true,
  },
  {
    id: 'case-03',
    clientId: 'placeholder-04',
    postId: 'placeholder-post-03',
    title: 'Placeholder case 03',
    whatWeDid: ['PLACEHOLDER: what we did'],
    whyItWorked: ['PLACEHOLDER: why it worked'],
    isPlaceholder: true,
  },
];
