import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { eventBriefSchema } from './event-brief';

export const recommendEvent = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => eventBriefSchema.parse(input))
  .handler(async ({ data }) => {
    const { generateRecommendation } = await import('./event-recommendation.server');
    return generateRecommendation(data, getRequest());
  });