<script lang="ts">
	import ModalWrapper from '$lib/client/components/ModalWrapper.svelte';
	import { listarAutomoveis } from '$lib/client/remote/automovel.remote';
	import { criarPedido } from '$lib/client/remote/pedido.remote';
	import type { InsertPedido, SelectAutomovel, SelectPedido } from '$lib/server/db/schema';
	import {
		AlertCircle,
		Calendar,
		Car,
		Check,
		CheckCircle,
		Clock,
		Info,
		MapPin,
		Search,
		Tag,
		X
	} from '@lucide/svelte';
	import type { PageProps } from './$types';
	import { debounce } from '$lib';
	import Loading from '$lib/client/components/Loading.svelte';
	import { toast } from 'svelte-sonner';

	let { data }: PageProps = $props();

	let searchQuery = $state('');
	let debouncedSearchTerm = $state('');

	let selectedVehicle: SelectAutomovel | undefined = $state();
	let orderPlaced = $state(false);

	let currentOrder: SelectPedido | undefined = $state();

	let isCreating = $state(false);

	const updateSearchTerm = debounce((term: string) => {
		debouncedSearchTerm = term;
	}, 300);

	function handleInputChange(event: Event) {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;
		updateSearchTerm(searchQuery);
	}

	function selectVehicle(vehicle: SelectAutomovel) {
		selectedVehicle = vehicle;
		setTimeout(() => {
			scrollTo({
				top: document.getElementById('order-form')?.offsetTop,
				behavior: 'smooth'
			});
		}, 100);
	}

	let formData: InsertPedido = $state({
		status: 'PENDENTE',
		data_pedido: new Date(),
		data_fim: null,
		data_inicio: null,
		observacoes: null
	});

	async function solicitarPedido() {
		isCreating = true;
		const toastId = toast.loading('Solicitando pedido...');

		if (!formData.data_inicio || !formData.data_fim || !selectedVehicle) {
			toast.error('Por favor, preencha todos os campos obrigatórios.', { id: toastId });
			isCreating = false;
			return;
		}

		try {
			currentOrder = await criarPedido({
				...formData,
				data_inicio: new Date(formData.data_inicio),
				data_fim: new Date(formData.data_fim),
				veiculo_id: selectedVehicle.matricula,
				cliente_id: data.cliente.id
			});
			toast.success('Pedido solicitado com sucesso!', { id: toastId });
		} catch (error) {
			orderPlaced = false;
			toast.error('Erro ao solicitar pedido. Tente novamente.', { id: toastId });
		} finally {
			isCreating = false;
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<header class="mb-10">
		<h1 class="text-primary mb-2 flex items-center text-3xl font-bold">
			<Car class="mr-2 inline" size={28} />
			Aluguel de Veículos
		</h1>
		<p class="text-base-content/70">Escolha e alugue o veículo ideal para a sua necessidade</p>
	</header>

	<div class="bg-base-200 mb-6 flex items-center gap-2 rounded-lg p-2">
		<Search size={20} class="text-base-content/50 ml-2" />
		<input
			type="text"
			oninput={handleInputChange}
			placeholder="Buscar por modelo, marca ou placa..."
			class="input input-ghost w-full focus:outline-none"
		/>
	</div>
	{#await listarAutomoveis(debouncedSearchTerm)}
		<Loading size="large" />
	{:then carros}
		{#if carros.length === 0}
			<div class="flex flex-col items-center justify-center py-12">
				<AlertCircle size={48} class="text-warning mb-4" />
				<h2 class="mb-2 text-xl font-semibold">Nenhum veículo encontrado</h2>
				<p class="text-base-content/70">Tente ajustar os termos da sua busca</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each carros as vehicle}
					<div
						class="card bg-base-100 border-base-200 transform overflow-hidden border shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
					>
						<figure class="group relative h-52 overflow-hidden">
							<img
								src={vehicle.image_link}
								alt={`${vehicle.marca} ${vehicle.modelo}`}
								class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
							/>
							<div class="absolute right-0 top-0 p-2">
								<div class="badge badge-primary font-semibold">{vehicle.ano}</div>
							</div>
						</figure>
						<div class="card-body p-5">
							<div class=" flex items-center justify-between">
								<h2 class="card-title text-primary text-xl font-bold">
									{vehicle.marca}
								</h2>
								<span class="text-lg font-medium">{vehicle.modelo}</span>
							</div>

							<div class="divider my-0"></div>

							<div class="mb-4 grid grid-cols-2 gap-2 text-sm">
								<div class="flex items-center">
									<Tag size={16} class="text-secondary mr-2" />
									<span>Matrícula: {vehicle.matricula}</span>
								</div>
								<div class="flex items-center">
									<MapPin size={16} class="text-error mr-2" />
									<span>Placa: {vehicle.placa}</span>
								</div>
								<div class="col-span-2 flex items-center">
									<Info size={16} class="text-info mr-2" />
									<span>ID: {vehicle.user_id.substring(0, 8)}...</span>
								</div>
							</div>

							<div class="card-actions mt-2">
								<button
									class="btn btn-primary btn-md w-full gap-2 font-semibold"
									onclick={() => selectVehicle(vehicle)}
								>
									<Car size={18} />
									Alugar agora
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>

			{#if selectedVehicle && !orderPlaced}
				<div id="order-form" class="border-base-300 card bg-base-200 mt-4 border shadow-md">
					<div class="card-body">
						<h2 class="mb-4 flex items-center text-2xl font-bold">
							<Calendar class="mr-2 inline" size={24} />
							Formulário de Aluguel
						</h2>

						<div class="bg-base-100 mb-6 rounded-lg p-4">
							<h3 class="text-lg font-semibold">Veículo Selecionado:</h3>
							<div class="mt-2 flex flex-col items-start md:flex-row md:items-center">
								<img
									src={selectedVehicle.image_link}
									alt={`${selectedVehicle.marca} ${selectedVehicle.modelo}`}
									class="mb-4 mr-4 h-24 w-32 rounded-lg object-cover md:mb-0"
								/>
								<div>
									<p class="text-xl font-bold">{selectedVehicle.marca} {selectedVehicle.modelo}</p>
									<p class="text-base-content/70">
										Ano: {selectedVehicle.ano} | Placa: {selectedVehicle.placa}
									</p>
								</div>
							</div>
						</div>

						<form class="space-y-4">
							<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div class="form-control">
									<label for="pickup-date" class="label">
										<span class="label-text">Data de Retirada</span>
									</label>
									<input
										type="date"
										id="pickup-date"
										required
										bind:value={formData.data_inicio}
										class="input input-bordered w-full"
									/>
								</div>

								<div class="form-control">
									<label for="return-date" class="label">
										<span class="label-text">Data de Devolução</span>
									</label>
									<input
										type="date"
										id="return-date"
										bind:value={formData.data_fim}
										required
										class="input input-bordered w-full"
									/>
								</div>
							</div>

							<div class="form-control">
								<fieldset class="fieldset">
									<legend class="fieldset-legend">Observações (Opcional)</legend>
									<textarea
										bind:value={formData.observacoes}
										class="textarea h-24 w-full"
										placeholder="Adicione qualquer observação ou requisitos especiais para o seu aluguel"
									></textarea>
								</fieldset>
							</div>

							<div class="mt-8 flex flex-col items-center justify-end gap-2 sm:flex-row">
								<button
									type="button"
									class="btn btn-ghost mb-4 sm:mb-0"
									onclick={() => (selectedVehicle = undefined)}
									><X size={16} class="mr-2 inline" /> Cancelar
								</button>
								<button
									type="submit"
									class="btn btn-primary w-full sm:w-auto"
									onclick={solicitarPedido}
									disabled={isCreating}
								>
									{#if isCreating}
										Criando Pedido...
									{:else}
										<Check size={16} class="mr-2 inline" />
										Confirmar Aluguel
									{/if}
								</button>
							</div>
						</form>
					</div>
				</div>
			{/if}

			{#if orderPlaced && currentOrder}
				<div class="bg-base-200 mt-16 rounded-xl p-6 shadow-lg">
					<div class="flex flex-col items-center text-center">
						{#if currentOrder.status === 'PENDENTE'}
							<div class="mb-4 animate-pulse">
								<Clock size={64} class="text-warning" />
							</div>
							<h2 class="mb-2 text-2xl font-bold">Pedido em Processamento</h2>
							<p class="mb-4">
								Seu pedido está sendo processado. Por favor, aguarde a confirmação.
							</p>
						{:else if currentOrder.status === 'CONFIRMADO'}
							<div class="mb-4">
								<CheckCircle size={64} class="text-success" />
							</div>
							<h2 class="mb-2 text-2xl font-bold">Pedido Confirmado!</h2>
							<p class="mb-4">Seu aluguel foi confirmado com sucesso.</p>
						{/if}

						<div class="bg-base-100 mb-6 w-full max-w-md rounded-lg p-4">
							<p class="font-semibold">Número do Pedido: #{currentOrder.id}</p>
							<p>Data: {currentOrder.data_pedido.toLocaleDateString()}</p>
							<p>
								Status: <span
									class="badge {currentOrder.status === 'CONFIRMADO'
										? 'badge-success'
										: 'badge-warning'}">{currentOrder.status}</span
								>
							</p>
						</div>

						{#if selectedVehicle}
							<div class="bg-base-100 mb-6 w-full max-w-md rounded-lg p-4">
								<h3 class="mb-2 text-lg font-semibold">Detalhes do Veículo:</h3>
								<p>{selectedVehicle.marca} {selectedVehicle.modelo}</p>
								<p>Ano: {selectedVehicle.ano} | Placa: {selectedVehicle.placa}</p>
							</div>
						{/if}

						<button class="btn btn-primary mt-4"> Fazer Novo Aluguel </button>
					</div>
				</div>
			{/if}
		{/if}
	{:catch error}
		{error}
	{/await}
</div>
