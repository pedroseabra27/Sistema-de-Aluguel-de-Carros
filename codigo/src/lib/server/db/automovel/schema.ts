import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { user } from '../auth-schema';

export const automovelT = pgTable('automovel', {
	matricula: serial('matricula').primaryKey(),
	ano: text('ano').notNull(),
	modelo: text('modelo').notNull(),
	marca: text('marca').notNull(),
	placa: text('placa').notNull(),
	user_id: text('user_id')
		.references(() => user.id)
		.notNull(),
	image_link: text()
});

export type SelectAutomovel = typeof automovelT.$inferSelect;
export type InsertAutomovel = typeof automovelT.$inferInsert;
