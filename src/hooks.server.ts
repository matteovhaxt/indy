// hooks.server.ts
import { env } from '$env/dynamic/private';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    process.env.E2B_API_KEY = env.E2B_API_KEY;

    return resolve(event);
};