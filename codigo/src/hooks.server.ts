import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handleUser: Handle = async ({ event, resolve }) => {
	const { request } = event;

	console.log(`${request.method}: ${new URL(request.url).pathname}`);

	try {
		const [session] = await Promise.all([auth.api.getSession({ headers: request.headers })]);

		event.locals.session = session;
	} catch (error) {
		console.error(error);
	}
	return resolve(event);
};

const authHandler: Handle = ({ event, resolve }) =>
	svelteKitHandler({ event, resolve, auth, building });

export const handle = sequence(authHandler, handleUser);
