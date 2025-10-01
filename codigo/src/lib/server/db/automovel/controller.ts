import { sql } from 'drizzle-orm';
import { db } from '..';
import { automovelT, type InsertAutomovel } from './schema';

export const veiculoController = () => ({
	criarVeiculo: async (newVeiculo: InsertAutomovel) => {
		if (!newVeiculo.placa) {
			throw new Error('Placa do veículo é necessária.');
		}

		await db.insert(automovelT).values(newVeiculo);
	},
	listarAutomoveis: async (titulo: string) => {
		return await db.query.automovelT.findMany({
			where: titulo
				? sql`(lower(${automovelT.modelo}) like ${`%${titulo.toLowerCase()}%`} OR 
						 lower(${automovelT.marca}) like ${`%${titulo.toLowerCase()}%`} OR 
						 lower(${automovelT.placa}) like ${`%${titulo.toLowerCase()}%`} OR 
						 ${automovelT.ano}::text like ${`%${titulo}%`})`
				: undefined
		});
		//FAZER JOIN DO USER
	}
});
