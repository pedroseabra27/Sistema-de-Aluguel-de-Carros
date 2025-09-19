import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const clienteT = pgTable('cliente', {
	id: serial('id').primaryKey(),
	rg: text('rg').notNull(),
	cpf: text('cpf').notNull(),
	nome: text('nome').notNull(),
	endereco: text().notNull(),
	profissao: text()
});

export type SelectCliente = typeof clienteT.$inferSelect;
export type InsertCliente = typeof clienteT.$inferInsert;