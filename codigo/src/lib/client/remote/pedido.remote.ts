import { command, query } from '$app/server';
import { pedidoController } from '$lib/server/db/pedido/controller';
import type { InsertPedido } from '$lib/server/db/pedido/schema';
import z from 'zod';

export const criarPedido = command(z.custom<InsertPedido>(), async (pedido) => {
	await pedidoController().criarPedido(pedido);
});

export const listarPedidos = query(async () => {
	return await pedidoController().listarPedidos();
});
