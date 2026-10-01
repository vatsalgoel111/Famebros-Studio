// Use only real messages with the client's written permission. Prefer a real screenshot (screenshot field) over recreated bubbles.

import { ProofItem } from '@/types';

export const proofItems: ProofItem[] = [
  {
    id: 'proof-01',
    clientId: 'placeholder-01',
    isPlaceholder: true,
    messages: [
      {
        from: 'client',
        text: 'PLACEHOLDER: client message goes here',
        time: '11:14 AM',
      },
      {
        from: 'famebros',
        text: 'PLACEHOLDER: client message goes here',
        time: '11:18 AM',
      },
      {
        from: 'client',
        text: 'PLACEHOLDER: client message goes here',
        time: '11:22 AM',
      },
    ],
  },
  {
    id: 'proof-02',
    clientId: 'placeholder-02',
    isPlaceholder: true,
    messages: [
      {
        from: 'client',
        text: 'PLACEHOLDER: client message goes here',
        time: '4:05 PM',
      },
      {
        from: 'famebros',
        text: 'PLACEHOLDER: client message goes here',
        time: '4:09 PM',
      },
      {
        from: 'client',
        text: 'PLACEHOLDER: client message goes here',
        time: '4:15 PM',
      },
    ],
  },
];
