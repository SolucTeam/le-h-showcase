import { z } from 'zod';

export const eventBriefSchema = z.object({
  type: z.string().trim().min(1).max(120),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location: z.string().trim().min(1).max(200),
  audience: z.string().trim().min(1).max(600),
  atmosphere: z.string().trim().min(1).max(1000),
  lang: z.enum(['fr', 'en', 'es']),
});
export type EventBrief = z.infer<typeof eventBriefSchema>;

export const SERVICE_CATALOG = [
  { name: 'Mainstage Takeovers', context: 'Festivals, grandes scènes, annonces artistes, transitions et énergie du public.' },
  { name: 'Concert & Live', context: 'Concerts, premières parties, chauffe de salle, interludes et coordination scène/régie.' },
  { name: 'The Catalyst Set', context: 'Clubs et after-shows, hype au micro, freestyle et complicité avec le DJ.' },
];

export function bookingHref(brief: EventBrief, recommendation: string) {
  const body = `${brief.type}\n${brief.date} — ${brief.location}\n${brief.audience}\n${brief.atmosphere}\n\n${recommendation}`;
  return `mailto:lehbookingpro@gmail.com?subject=${encodeURIComponent(`Booking LE H — ${brief.type}`)}&body=${encodeURIComponent(body)}`;
}