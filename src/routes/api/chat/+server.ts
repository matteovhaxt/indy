import { createAnthropic } from '@ai-sdk/anthropic';
import { convertToCoreMessages, streamText } from 'ai';
import type { RequestHandler } from './$types';

import { env } from '$env/dynamic/private';

const openai = createAnthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

export const POST = (async ({ request }) => {
  const { messages } = await request.json();

  const result = await streamText({
    model: openai('claude-3-5-sonnet-20240620'),
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;