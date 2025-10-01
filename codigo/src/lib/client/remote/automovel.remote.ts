import { query } from '$app/server';
import { veiculoController } from '$lib/server/db/automovel/controller';
import z from 'zod';

export const listarAutomoveis = query(z.string(), async (titulo) => {
	const veiculos = await veiculoController().listarAutomoveis(titulo);
	return veiculos;
});
