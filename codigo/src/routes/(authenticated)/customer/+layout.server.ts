import { db } from '$lib/server/db';
import { clienteT } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load = (async ({ parent }) => {
	const { session } = await parent();

	const cliente = await db.query.clienteT.findFirst({
		where: eq(clienteT.email, session.user.email)
	});


	if (!cliente) {
		throw redirect(303, '/finalizar-cadastro/?redirectTo=/customer/pedido');
	}

	return { cliente };
}) satisfies LayoutServerLoad;
