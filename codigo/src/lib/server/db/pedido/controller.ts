import { eq } from 'drizzle-orm';
import { db } from '..';
import { pedidoT, type InsertPedido, statusPedidoEnum } from './schema';

export const pedidoController = () => ({
	criarPedido: async (pedido: InsertPedido) => {
		const [newPedido] = await db.insert(pedidoT).values(pedido).returning();
		return newPedido;
	},
	listarPedidos: async () => {
		return await db.select().from(pedidoT);
	},
	listarPedidosCliente: async (clienteId: number) => {
		return await db.query.pedidoT.findMany({
			where: eq(pedidoT.cliente_id, clienteId),
			with: {
				veiculo: true
			}
		});
	},
	listarTodosPedidosComCliente: async () => {
		return await db.query.pedidoT.findMany({
			with: {
				cliente: true,
				veiculo: true
			}
		});
	},
	atualizarStatusPedido: async (pedidoId: number, status: typeof statusPedidoEnum.enumValues[number]) => {
		const [updatedPedido] = await db
			.update(pedidoT)
			.set({ status })
			.where(eq(pedidoT.id, pedidoId))
			.returning();
		return updatedPedido;
	}
});
