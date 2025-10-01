<script lang="ts">
	import {
		criarCliente,
		editarCliente,
		excluirCliente,
		listarClientes
	} from '$lib/client/remote/cliente.remote';
	import type { InsertCliente, SelectCliente } from '$lib/server/db/schema';
	import { toast } from 'svelte-sonner';

	let newCustomer = $state<InsertCliente>({
		rg: '',
		cpf: '',
		nome: '',
		endereco: '',
		profissao: null
	});

	let customerToEdit = $state<SelectCliente | null>(null);
	let showEditModal = $state(false);
	let showCreateModal = $state(false);

	let searchQuery = $state('');

	let isCreating = $state(false);
	async function handleSubmit() {
		isCreating = true;
		const toastId = toast.loading('Criando cliente...');
		try {
			await criarCliente(newCustomer);
			resetForm();
			showCreateModal = false;
			toast.success('Sucesso ao criar cliente!', { id: toastId });
		} catch (error) {
			toast.error('Erro ao criar cliente', { id: toastId });
		} finally {
			isCreating = false;
		}
	}

	function editCustomer(cliente: SelectCliente) {
		customerToEdit = { ...cliente };
		showEditModal = true;
	}

	let isUpdating = $state(false);
	async function updateCustomer() {
		if (!customerToEdit) return;

		isUpdating = true;
		const toastId = toast.loading('Atualizando cliente...');
		try {
			await editarCliente({ id: customerToEdit.id, data: customerToEdit });
			showEditModal = false;
			toast.success('Sucesso ao atualizar cliente!', { id: toastId });
		} catch (error) {
			toast.error('Erro ao atualizar cliente', { id: toastId });
		} finally {
			isUpdating = false;
		}
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

	function openCreateModal() {
		resetForm();
		showCreateModal = true;
	}
</script>

<div class="p-4">
	<div class="mb-6 flex items-center justify-between">
		<h1 class=" text-2xl font-bold">Gestão de Clientes</h1>
		<button class="btn btn-primary" onclick={openCreateModal}>Novo Cliente</button>
	</div>

	<div class="card bg-base-100 border-base-200 rounded-md border shadow-xl">
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
											<button class="btn btn-sm btn-info" onclick={() => editCustomer(customer)}
												>Editar</button
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

{#if showCreateModal}
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="mb-4 text-lg font-bold">Novo Cliente</h3>

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

			<div class="modal-action">
				<button class="btn btn-primary" disabled={isCreating} onclick={handleSubmit}>
					{isCreating ? 'Criando...' : 'Cadastrar'}
				</button>
				<button class="btn" onclick={() => (showCreateModal = false)}> Cancelar </button>
			</div>
		</div>
		<div class="modal-backdrop" onclick={() => (showCreateModal = false)}></div>
	</div>
{/if}

{#if showEditModal && customerToEdit}
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="mb-4 text-lg font-bold">Editar Cliente</h3>

			<div class="form-control">
				<label class="label" for="edit-nome">
					<span class="label-text">Nome Completo</span>
				</label>
				<input
					type="text"
					id="edit-nome"
					class="input input-bordered w-full"
					bind:value={customerToEdit.nome}
					required
				/>
			</div>

			<div class="form-control mt-2">
				<label class="label" for="edit-rg">
					<span class="label-text">RG</span>
				</label>
				<input
					type="text"
					id="edit-rg"
					class="input input-bordered w-full"
					bind:value={customerToEdit.rg}
					required
				/>
			</div>

			<div class="form-control mt-2">
				<label class="label" for="edit-cpf">
					<span class="label-text">CPF</span>
				</label>
				<input
					type="text"
					id="edit-cpf"
					class="input input-bordered w-full"
					bind:value={customerToEdit.cpf}
					required
				/>
			</div>

			<div class="form-control mt-2">
				<label class="label" for="edit-endereco">
					<span class="label-text">Endereço</span>
				</label>
				<textarea
					id="edit-endereco"
					class="textarea textarea-bordered w-full"
					bind:value={customerToEdit.endereco}
					required
				></textarea>
			</div>

			<div class="form-control mt-2">
				<label class="label" for="edit-profissao">
					<span class="label-text">Profissão</span>
				</label>
				<input
					type="text"
					id="edit-profissao"
					class="input input-bordered w-full"
					bind:value={customerToEdit.profissao}
				/>
			</div>

			<div class="modal-action">
				<button class="btn btn-primary" disabled={isUpdating} onclick={updateCustomer}>
					{isUpdating ? 'Atualizando...' : 'Atualizar'}
				</button>
				<button class="btn" onclick={() => (showEditModal = false)}> Cancelar </button>
			</div>
		</div>
		<div class="modal-backdrop" onclick={() => (showEditModal = false)}></div>
	</div>
{/if}
