import { db } from '..';
import { automovelT, type InsertAutomovel } from './schema';

export const veiculoController = () => ({
	criarVeiculo: async (newVeiculo: InsertAutomovel) => {
		if (!newVeiculo.placa) {
			throw new Error('Placa do veículo é necessária.');
		}

		await db.insert(automovelT).values(newVeiculo);
	},
	listarAutomoveis: async () => {
		return await db.query.automovelT.findMany();
		//FAZER JOIN DO USER
	}
});
