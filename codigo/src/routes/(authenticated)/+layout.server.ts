import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals: { session } }) => {
    if (!session) {
        throw redirect(303, '/login');
    }

    if (session.user.role) {
        redirect(303, `/${session.user.role}`);
    }

    return { session };
}) satisfies LayoutServerLoad;