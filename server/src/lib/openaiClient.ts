import OpenAI from 'openai';
import { sanitizeForAi } from './sanitizeForAi';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required.');
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const originalCreate = client.chat.completions.create.bind(client.chat.completions);
(client.chat.completions as { create: typeof originalCreate }).create = ((
  params: Parameters<typeof originalCreate>[0],
  options?: Parameters<typeof originalCreate>[1]
) => originalCreate(sanitizeForAi(params), options)) as typeof originalCreate;

export const openai = client;
