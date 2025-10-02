import { db } from '..';
import { pedidoT, type InsertPedido} from './schema';

export const pedidoController = () => ({
	criarPedido: async (pedido: InsertPedido) => {
		const [newPedido] = await db.insert(pedidoT).values(pedido).returning();
		return newPedido;
	},
    listarPedidos: async () => {
        return await db.select().from(pedidoT)
    }
});
