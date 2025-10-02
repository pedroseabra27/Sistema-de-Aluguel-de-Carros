import { integer, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { automovelT, clienteT } from '../schema';

export const statusPedidoEnum = pgEnum('statusPedido', ['PENDENTE', 'CONCLUIDO', 'CONFIRMADO']);

export const pedidoT = pgTable('pedido', {
	id: serial('id').primaryKey(),
	data_pedido: timestamp('data').notNull(),
	data_inicio: timestamp('data_inicio'),
	data_fim: timestamp('data_fim'),
	observacoes: text('observacoes'),
	status: statusPedidoEnum(),
	cliente_id: integer('cliente_id').references(() => clienteT.id),
	veiculo_id: integer('veiculo_id').references(() => automovelT.matricula)
});

export type SelectPedido = typeof pedidoT.$inferSelect;
export type InsertPedido = typeof pedidoT.$inferInsert;
