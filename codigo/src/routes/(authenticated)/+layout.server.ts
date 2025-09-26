import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const session = locals.session;

	if (!session) {
		redirect(304, '/login');
	}
}) satisfies LayoutServerLoad;
