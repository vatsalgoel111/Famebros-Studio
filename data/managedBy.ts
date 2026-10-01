// DRAFT COPY - confirm each description with Famebros before launch.

export interface ManagedByItem {
  id: string;
  number: string;
  verb: string;
  description: string;
}

export const managedByItems: ManagedByItem[] = [
  {
    id: '01',
    number: '01',
    verb: 'We shoot it.',
    description:
      'Concepts, shot lists and shoot days for reels, product shots and brand content.',
  },
  {
    id: '02',
    number: '02',
    verb: 'We cut it.',
    description:
      'Editing, sound and pacing, built around the first second of a reel.',
  },
  {
    id: '03',
    number: '03',
    verb: 'We post it.',
    description:
      'Scheduling and publishing on a steady calendar, across your accounts.',
  },
  {
    id: '04',
    number: '04',
    verb: 'We answer the comments.',
    description:
      'Replies to comments and messages, so your audience gets a response.',
  },
  {
    id: '05',
    number: '05',
    verb: 'We send the numbers.',
    description:
      'Regular reporting on what performed and what to do next.',
  },
];
