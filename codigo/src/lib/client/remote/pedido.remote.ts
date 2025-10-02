import { command, query } from '$app/server';
import { pedidoController } from '$lib/server/db/pedido/controller';
import type { InsertPedido } from '$lib/server/db/pedido/schema';
import z from 'zod';

export const criarPedido = command(z.custom<InsertPedido>(), async (pedido) => {
	return await pedidoController().criarPedido(pedido);
});

export const listarPedidos = query(async () => {
	return await pedidoController().listarPedidos();
});

export const listarPedidosCliente = query(z.number(), async (clienteId) => {
	return await pedidoController().listarPedidosCliente(clienteId);
});

export type listarPedidosClienteType = Awaited<ReturnType<typeof listarPedidosCliente>>;