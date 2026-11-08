export type PolymathResourceKind = 'READING' | 'BOOK' | 'COURSE' | 'REFERENCE' | 'PDF';

export interface PolymathResource {
  id: string;
  kind: PolymathResourceKind;
  title: string;
  source: string;
  description: string;
  note: string;
  tags: string[];
  url: string;
  linkLabel?: string;
}

export const polymathResources: PolymathResource[] = [
  {
    id: 'orange-confusion-attacks',
    kind: 'REFERENCE',
    title: 'Orange Confusion Attacks',
    source: 'Black Hat USA 2024',
    description: 'A presentation on exploiting hidden semantic behavior in security systems.',
    note: 'A resource for understanding how ambiguity and hidden meaning can create unexpected attack paths.',
    tags: ['Security Research', 'Semantic Attacks', 'Black Hat'],
    url: 'https://i.blackhat.com/BH-US-24/Presentations/US24-Orange-Confusion-Attacks-Exploiting-Hidden-Semantic-Thursday.pdf',
  },
];
