/* eslint-disable @typescript-eslint/no-unused-vars */
import { eq, inArray, like, sql } from 'drizzle-orm';
import { db } from '..';
import { clienteT, type InsertCliente } from './schema';

export const clienteController = () => ({
	criarCliente: async (newCliente: InsertCliente) => {
		await db.insert(clienteT).values(newCliente);
	},
	editarCliente: async (id: number, newInfo: Partial<InsertCliente>) => {
		await db.update(clienteT).set(newInfo).where(eq(clienteT.id, id));
	},
	excluirCliente: async (id: number) => {
		await db.delete(clienteT).where(eq(clienteT.id, id));
	},
	listarClientes: async (nome: string) => {
		return await db.query.clienteT.findMany({
			where: nome ? like(sql`lower(${clienteT.nome})`, `%${nome.toLowerCase()}%`) : undefined
		});
	}
});
