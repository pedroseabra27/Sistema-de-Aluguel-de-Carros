import { pgEnum, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';

export const statusPedidoEnum = pgEnum('statusPedido', ['PENDENTE', 'CONCLUIDO', 'CONFIRMADO']);

export const pedidoT = pgTable('pedido', {
	id: serial('id').primaryKey(),
	data_pedido: timestamp('data').notNull(),
	status: statusPedidoEnum()
});

export type SelectPedido = typeof pedidoT.$inferSelect;
export type InsertPedido = typeof pedidoT.$inferInsert;
