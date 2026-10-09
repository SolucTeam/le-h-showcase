import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { bookingHref, eventBriefSchema } from './event-brief';

const brief = { type: 'festival', date: '2026-12-12', location: 'Paris', audience: '800 personnes', atmosphere: 'Afrobeats, énergie et interactions', lang: 'fr' };
describe('Event recommendations', () => {
  for (const field of ['type', 'date', 'location', 'audience', 'atmosphere']) {
    it(`requires the organiser's ${field}`, () => { assert.equal(eventBriefSchema.safeParse({ ...brief, [field]: '' }).success, false); });
  }
  it('includes the five supplied event fields in a direct booking email', () => {
    const parsed = eventBriefSchema.parse(brief);
    const href = bookingHref(parsed, 'Mainstage Takeovers');
    assert.equal(href.startsWith('mailto:lehbookingpro@gmail.com?'), true);
    const decoded = decodeURIComponent(href);
    for (const field of ['type', 'date', 'location', 'audience', 'atmosphere'] as const) assert.ok(decoded.includes(parsed[field]));
  });
});