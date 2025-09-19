<script lang="ts">
	import { criarCliente, excluirCliente, listarClientes } from '$lib/client/remote/cliente.remote';
	import type { InsertCliente } from '$lib/server/db/schema';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let newCustomer = $state<InsertCliente>({
		rg: '',
		cpf: '',
		nome: '',
		endereco: '',
		profissao: null
	});

	let isEditing = $state(false);
	let editingIndex = $state(-1);
	let searchQuery = $state('');

	let isCreating = $state(false);
	async function handleSubmit() {
		isCreating = true;
		const toastId = toast.loading('Criando cliente...');
		try {
			await criarCliente(newCustomer);
			resetForm();
			toast.success('Sucesso ao criar cliente!', { id: toastId });
		} catch (error) {
			toast.error('Erro ao criar cliente', { id: toastId });
		} finally {
			isCreating = false;
		}
	}

	function editCustomer(index: number) {
		isEditing = true;
		editingIndex = index;
	}

	let isDeleting = $state(false);

	async function deleteCustomer(id: number) {
		isDeleting = true;
		const toastId = toast.loading('Excluindo cliente...');
		try {
			await excluirCliente(id);
			toast.success('Sucesso ao deletar cliente!', { id: toastId });
		} catch (error) {
			toast.error('Erro ao deletar cliente', { id: toastId });
		} finally {
			isDeleting = false;
		}
	}

	function resetForm() {
		newCustomer = {
			rg: '',
			cpf: '',
			nome: '',
			endereco: '',
			profissao: null
		};
	}
</script>

<div class="p-4">
	<h1 class="mb-6 text-2xl font-bold">Gestão de Clientes</h1>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<div class="card bg-base-100 border-base-200 border shadow-xl">
			<div class="card-body">
				<h2 class="card-title">{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</h2>
				<div>
					<div class="form-control">
						<label class="label" for="nome">
							<span class="label-text">Nome Completo</span>
						</label>
						<input
							type="text"
							id="nome"
							class="input input-bordered w-full"
							bind:value={newCustomer.nome}
							required
						/>
					</div>

					<div class="form-control mt-2">
						<label class="label" for="rg">
							<span class="label-text">RG</span>
						</label>
						<input
							type="text"
							id="rg"
							class="input input-bordered w-full"
							bind:value={newCustomer.rg}
							required
						/>
					</div>

					<div class="form-control mt-2">
						<label class="label" for="cpf">
							<span class="label-text">CPF</span>
						</label>
						<input
							type="text"
							id="cpf"
							class="input input-bordered w-full"
							bind:value={newCustomer.cpf}
							required
						/>
					</div>

					<div class="form-control mt-2">
						<label class="label" for="endereco">
							<span class="label-text">Endereço</span>
						</label>
						<textarea
							id="endereco"
							class="textarea textarea-bordered w-full"
							bind:value={newCustomer.endereco}
							required
						></textarea>
					</div>

					<div class="form-control mt-2">
						<label class="label" for="profissao">
							<span class="label-text">Profissão</span>
						</label>
						<input
							type="text"
							id="profissao"
							class="input input-bordered w-full"
							bind:value={newCustomer.profissao}
						/>
					</div>

					<div class="form-control mt-4 w-full flex-row gap-2">
						<button
							type="button"
							class="btn btn-primary w-full"
							disabled={isCreating}
							onclick={handleSubmit}>{isEditing ? 'Atualizar' : 'Cadastrar'}</button
						>
						{#if isEditing}
							<button
								type="button"
								class="btn btn-outline"
								onclick={() => {
									isEditing = false;
									resetForm();
								}}>Cancelar</button
							>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="lg:col-span-2">
			<div class="card bg-base-100 border-base-200 border shadow-xl">
				<div class="card-body">
					<div class="mb-4 flex flex-col justify-between md:flex-row">
						<h2 class="card-title">Lista de Clientes</h2>
						<div class="form-control">
							<input
								type="text"
								placeholder="Buscar cliente..."
								class="input input-bordered w-full"
								bind:value={searchQuery}
							/>
						</div>
					</div>

					<div class="overflow-x-auto">
						{#await listarClientes(searchQuery)}
							Carregando....
						{:then clientes}
							{#if clientes.length > 0}
								<table class="table-zebra table w-full">
									<thead>
										<tr>
											<th>Nome</th>
											<th>CPF</th>
											<th>RG</th>
											<th>Profissão</th>
											<th>Ações</th>
										</tr>
									</thead>
									<tbody>
										{#each clientes as customer, i}
											<tr>
												<td>{customer.nome}</td>
												<td>{customer.cpf}</td>
												<td>{customer.rg}</td>
												<td>{customer.profissao || '-'}</td>
												<td class="flex gap-2">
													<button
														class="btn btn-sm btn-info"
														onclick={() => editCustomer(customer.id)}>Editar</button
													>
													<button
														class="btn btn-sm btn-error"
														disabled={isDeleting}
														onclick={() => deleteCustomer(customer.id)}>Excluir</button
													>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							{:else}
								<div class="alert">
									<span>Nenhum cliente encontrado.</span>
								</div>
							{/if}
						{:catch error}
							{error}
						{/await}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
