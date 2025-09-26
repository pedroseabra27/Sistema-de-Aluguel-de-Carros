import { db } from '..';
import { pedidoT, type InsertPedido} from './schema';

export const pedidoController = () => ({
	criarPedido: async (pedido: InsertPedido) => {
		await db.insert(pedidoT).values(pedido);
	},
    listarPedidos: async () => {
        return await db.select().from(pedidoT)
    }
});
