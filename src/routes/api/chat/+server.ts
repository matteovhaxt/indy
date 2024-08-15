import { createAnthropic } from '@ai-sdk/anthropic';
import { convertToCoreMessages, streamText, tool } from 'ai';
import type { RequestHandler } from './$types';

import { env } from '$env/dynamic/private';
import { z } from 'zod';
import { getFileTree, readFromFile, runCommand, SandboxTemplate, writeToFile } from '$lib/modules/sandbox';

const openai = createAnthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

export const POST = (async ({ request }) => {
  const { messages } = await request.json();

  const result = await streamText({
    model: openai('claude-3-5-sonnet-20240620'),
    messages: convertToCoreMessages(messages),
    system: 'You are a helpful assistant that can write to and read from files, run commands, and help with Next.js development.',
    tools: {
      writeToFile: tool({
        description: 'Write to a file',
        parameters: z.object({
          path: z.string().describe('The path to write to'),
          content: z.string().describe('The code to write to the file'),
        }),
        execute: async ({ path, content }) => {
          console.log('Writing to file', path, content);
          const { url } = await writeToFile(SandboxTemplate.NextJS, path, content);
          console.log('File content', url);
          return 'Successfully wrote to file';
        },
      }),
      readFromFile: tool({
        description: 'Read from a file',
        parameters: z.object({
          path: z.string().describe('The path to read from'),
        }),
        execute: async ({ path }) => {
          console.log('Reading from file', path);
          const { content } = await readFromFile(SandboxTemplate.NextJS, path);
          console.log('File content', content);
          return content;
        },
      }),
      runCommand: tool({
        description: 'Run a command',
        parameters: z.object({
          command: z.string().describe('The command to run'),
        }),
        execute: async ({ command }) => {
          console.log('Running command', command);
          const { output } = await runCommand(SandboxTemplate.NextJS, command);
          console.log('Command output', output);
          return output;
        },
      }),
      getFileTree: tool({
        description: 'Get the file tree',
        parameters: z.object({
          path: z.string().describe('The path to get the file tree from'),
        }),
        execute: async ({ path }) => {
          console.log('Getting file tree', path);
          const { files } = await getFileTree(SandboxTemplate.NextJS, path);
          console.log('File tree', files);
          return files;
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;