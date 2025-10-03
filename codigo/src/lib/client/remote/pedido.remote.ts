import { command, query } from '$app/server';
import { pedidoController } from '$lib/server/db/pedido/controller';
import type { InsertPedido } from '$lib/server/db/pedido/schema';
import { statusPedidoEnum } from '$lib/server/db/pedido/schema';
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

export const listarTodosPedidosComCliente = query(async () => {
	return await pedidoController().listarTodosPedidosComCliente();
});

export const atualizarStatusPedido = command(
	z.object({
		pedidoId: z.number(),
		status: z.enum(statusPedidoEnum.enumValues)
	}),
	async ({ pedidoId, status }) => {
		const result = await pedidoController().atualizarStatusPedido(pedidoId, status);

		await listarTodosPedidosComCliente().refresh();
		return result;
	}
);

export type listarPedidosClienteType = Awaited<ReturnType<typeof listarPedidosCliente>>;
export type listarTodosPedidosComClienteType = Awaited<ReturnType<typeof listarTodosPedidosComCliente>>;