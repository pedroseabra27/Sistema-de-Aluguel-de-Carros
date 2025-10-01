import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { clienteT } from '$lib/server/db/schema';

export const load = (async ({ locals: { session } }) => {
	if (!session) {
		redirect(303, '/login');
	}

	const cliente = await db.query.clienteT.findFirst({
		where: eq(clienteT.email, session.user.email)
	});

	if (cliente) {
		redirect(303, '/customer/pedido');
	}
	return { session };
}) satisfies PageServerLoad;
