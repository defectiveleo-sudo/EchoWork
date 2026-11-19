export const FAQ = [
  {
    id: '1',
    question: 'What is Echo Client?',
    answer:
      'Echo Client is a Minecraft client built for the latest versions. It focuses on modern combat and PvP, including spears, maces, and other niche modes. Built by Cyde.',
  },
  {
    id: '2',
    question: 'Is Echo Client free?',
    answer:
      'In this demo, yes — every plan is listed at $0.00 and no payment is ever requested or processed. The upgrade flow is a front-end simulation only.',
  },
  {
    id: '3',
    question: 'What versions are supported?',
    answer:
      'Echo Client supports Minecraft 1.21.11, 26.1, 26.1.1, 26.1.2, 26.2 and 26.3. We aim to fastly support future updates as they are released.',
  },
  {
    id: '4',
    question: 'Is it undetectable?',
    answer:
      'Echo Client focuses on "Ghost" modules, prioritizing undetectability on major servers while providing a competitive edge. We target popular anti-cheats to ensure our users can use the client with confidence.',
  },
];

export const CREATORS = [
  { name: 'Cyde', url: 'https://www.youtube.com/@cydeYT', color: '#8A5D98' },
  { name: 'ItzOwo', url: 'https://www.youtube.com/@ItzOwo', color: '#009AFE' },
  { name: 'Tasin', url: 'https://www.youtube.com/@Tasin', color: '#FFDE36' },
];

export const SUPPORTED_VERSIONS = '1.21.11–26.3';

export interface ChangelogSection {
  title: 'Highlights' | 'Added' | 'Changed' | 'Fixed' | 'Removed';
  /** Plain items; text before the first ": " is rendered bold when the item has one. */
  items: string[];
}

export interface Release {
  version: string;
  date: string; // ISO date
  sections: ChangelogSection[];
}

export const RELEASES: Release[] = [
  {
    version: '1.3.5',
    date: '2026-10-31',
    sections: [
      { title: 'Added', items: ['Pearl Grapple', 'Health-based Totem Swap'] },
      { title: 'Fixed', items: ['Minor bugs'] },
    ],
  },
  { version: '1.3.4', date: '2026-10-20', sections: [{ title: 'Added', items: ['Ghost Hand'] }] },
  {
    version: '1.3.3',
    date: '2026-10-10',
    sections: [
      {
        title: 'Added',
        items: [
          'Pearl Grapple: new module [beta].',
          'Pearl Catch: new *Retry* setting.',
          'Auto Totem: new *Health Swap* option.',
          'Targets: new *Simulate Clicks* option [beta].',
          'Watermark now shows your Echo username.',
        ],
      },
      {
        title: 'Fixed',
        items: [
          'Pearl Catch: improved catch accuracy.',
          'Hit timing now accounts for lag spikes.',
          'Mouse binds not working with Raw Input Buffer.',
          'Configs are now kept after internet reconnection.',
        ],
      },
    ],
  },
  {
    version: '1.3.2',
    date: '2026-09-29',
    sections: [
      {
        title: 'Added',
        items: ['Auto Clicker: new *Randomization* setting with None and Normal modes.', 'Mace Swap: new *Mace Priority*'],
      },
      { title: 'Fixed', items: ['Performance', 'Minor issues'] },
    ],
  },
  {
    version: '1.3.1',
    date: '2026-09-25',
    sections: [
      {
        title: 'Added',
        items: ['Shield Breaker Hotbar and Item whitelist', 'Mace Swap: new *Fallback* option.'],
      },
      { title: 'Changed', items: ['Prevent: settings split into categories.'] },
    ],
  },
  {
    version: '1.3.0',
    date: '2026-09-25',
    sections: [
      {
        title: 'Highlights',
        items: [
          'New GUI',
          'Rewritten rendering, auth and loader.',
          'Support for 26.2 and 26.3.',
          'Online configs',
          'Mac support',
          'Improved Linux support',
        ],
      },
      {
        title: 'Added',
        items: [
          'Hold binds, which keep a module enabled only while its key is held.',
          'Number settings can be edited by typing in a value.',
          'Array List: new *Visibility* filter setting.',
          'Item ESP: new module.',
          'Sky Shaders: new module with Nebula, Aurora and Twilight modes.',
          'Target ESP: new *Circle* mode.',
        ],
      },
      {
        title: 'Changed',
        items: [
          'Improved rotations.',
          'Reduced the gap in ESP.',
          'Aim Assist: improved.',
          'Player ESP: redesigned.',
          'Trigger Bot: reworked, and the delay sliders are now ranges.',
        ],
      },
    ],
  },
];

export const formatDate = (iso: string) =>
  new Date(iso + (iso.length === 10 ? 'T12:00:00' : '')).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
