import { query } from '$app/server';
import { veiculoController } from '$lib/server/db/automovel/controller';

export const listarAutomoveis = query(async () => {
	const veiculos = await veiculoController().listarAutomoveis();
	return veiculos;
});
