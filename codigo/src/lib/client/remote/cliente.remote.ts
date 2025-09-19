import { command, query } from '$app/server';
import { clienteController } from '$lib/server/db/cliente/controller';
import type { InsertCliente } from '$lib/server/db/schema';
import z from 'zod';

export const criarCliente = command(z.custom<InsertCliente>(), async (dados) => {
	await clienteController().criarCliente(dados);
	await listarClientes('').refresh();
});

export const listarClientes = query(z.string(), async (titulo) => {
	const clientes = await clienteController().listarClientes(titulo);
	console.log(clientes);
	return clientes;
});

export const editarCliente = command(
	z.object({ id: z.number(), data: z.custom<Partial<InsertCliente>>() }),
	async (dados) => {
		await clienteController().editarCliente(dados.id, dados.data);
		await listarClientes('').refresh();
	}
);

export const excluirCliente = command(z.number(), async (id) => {
	await clienteController().excluirCliente(id);
	await listarClientes('').refresh();
});
