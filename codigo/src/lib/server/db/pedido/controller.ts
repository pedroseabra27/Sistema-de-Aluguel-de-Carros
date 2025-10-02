import { eq } from 'drizzle-orm';
import { db } from '..';
import { pedidoT, type InsertPedido } from './schema';

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
	}
});
