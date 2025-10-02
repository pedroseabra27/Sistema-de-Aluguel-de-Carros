<script lang="ts">
	import { formatDate } from '$lib';
	import Loading from '$lib/client/components/Loading.svelte';
	import SelectSearch from '$lib/client/components/SelectSearch.svelte';
	import { listarAutomoveis } from '$lib/client/remote/automovel.remote';
	import {
		listarPedidosCliente,
		type listarPedidosClienteType
	} from '$lib/client/remote/pedido.remote';
	import type { SelectPedido } from '$lib/server/db/schema';
	import type { PageProps } from './$types';
	import {
		Calendar,
		Car,
		CheckCircle,
		Clock,
		FileText,
		PackageOpen,
		AlertTriangle,
		ChevronDown,
		ChevronUp,
		ArrowLeft,
		Eye,
		ListFilter
	} from '@lucide/svelte';

	let { data }: PageProps = $props();

	let statusFilter: Exclude<SelectPedido['status'], null> | '' = $state('');

	let carFilter = $state('');

	let isExpanded: Record<SelectPedido['id'], boolean> = $state({});

	const getStatusBadge = (status: SelectPedido['status']) => {
		switch (status) {
			case 'PENDENTE':
				return { class: 'badge-warning', icon: Clock, text: 'Pendente' };
			case 'CONFIRMADO':
				return { class: 'badge-info', icon: PackageOpen, text: 'Confirmado' };
			case 'CONCLUIDO':
				return { class: 'badge-success', icon: CheckCircle, text: 'Concluído' };
			default:
				return { class: 'badge-ghost', icon: AlertTriangle, text: 'Desconhecido' };
		}
	};

	const calculateDuration = (start: Date | undefined | null, end: Date | undefined | null) => {
		if (!start || !end) return 'N/A';
		const startDate = new Date(start);
		const endDate = new Date(end);
		const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays === 1 ? '1 dia' : `${diffDays} dias`;
	};

	const toggleExpanded = (id: SelectPedido['id']) => {
		isExpanded = { ...isExpanded, [id]: !isExpanded[id] };
	};

	const filterOrdersByStatus = (orders: listarPedidosClienteType) => {
		if (!statusFilter) return orders;
		return orders.filter((order) => order.status === statusFilter);
	};

	const filterOrderByCar = (orders: listarPedidosClienteType, carId: string | null) => {
		if (!carId) return orders;
		const numericCarId = parseInt(carId, 10);
		return orders.filter((order) => order.veiculo_id === numericCarId);
	};

	const Status: Record<Exclude<SelectPedido['status'], null>, string> = {
		PENDENTE: 'Pendente',
		CONFIRMADO: 'Confirmado',
		CONCLUIDO: 'Concluído'
	};

	const statusOptions = [...Object.entries(Status).map(([value, label]) => ({ value, label }))];
</script>

<div class="container mx-auto px-4 py-8">
	<header class="mb-3 flex items-center justify-between">
		<div class="flex flex-col items-start">
			<h1 class="text-primary flex items-center text-3xl font-bold">
				<FileText class="mr-3" size={28} />
				Meus Aluguéis
			</h1>

			<p class="text-base-content/70 mt-2">
				Gerencie e visualize o histórico dos seus pedidos de aluguel
			</p>
		</div>

		<div class=" flex flex-wrap items-center justify-end gap-4 rounded-lg">
			<button
				class="btn btn-primary min-w-60 gap-2"
				popovertarget="popover-3"
				style="anchor-name:--anchor-3"
			>
				Filtrar pedidos <ListFilter size={18} class="ml-2" />
			</button>
			<ul
				class="dropdown dropdown-end menu rounded-box card card-compact bg-base-200 flex w-80 flex-col gap-2 shadow-lg"
				popover
				id="popover-3"
				style="position-anchor:--anchor-3"
			>
				<div class="card-body gap-4">
					<h2 class="card-title">Filtrar Pedidos</h2>
					<p class="text-base-content/70 text-sm">
						Use os filtros abaixo para refinar a lista de pedidos exibidos.
					</p>

					<div class="form-control">
						<label class="label" for="statusFilter">
							<span class="label-text">Status</span>
						</label>
						<SelectSearch
							config={{ label: (item) => item.label, value: (item) => item.value }}
							delegateQuery={() => Promise.resolve(statusOptions)}
							placeholder="status"
							bind:value={statusFilter}
							componentId="1"
						/>
					</div>

					<div class="form-control">
						<label class="label" for="carFilter">
							<span class="label-text">Veículo</span>
						</label>
						<SelectSearch
							config={{ label: (item) => item.modelo, value: (item) => item.matricula }}
							delegateQuery={() => listarAutomoveis('')}
							placeholder="veiculo"
							bind:value={carFilter}
							componentId="2"
						/>
					</div>
				</div>
			</ul>
		</div>
	</header>

	<div class="divider"></div>

	{#await listarPedidosCliente(data.cliente.id)}
		<div class="flex justify-center py-16">
			<Loading size="large" />
		</div>
	{:then pedidos}
		{#if pedidos.length === 0}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<PackageOpen size={64} class="text-base-content/30 mb-4" />
				<h2 class="mb-2 text-2xl font-semibold">Nenhum aluguel encontrado</h2>
				<p class="text-base-content/70 mb-6">Você ainda não realizou nenhum pedido de aluguel.</p>
				<a href="/customer/solicitar" class="btn btn-primary">Alugar um veículo</a>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each filterOrdersByStatus(filterOrderByCar(pedidos, carFilter)) as pedido}
					{@const statusBadge = getStatusBadge(pedido.status)}
					{@const expanded = isExpanded[pedido.id] || false}

					<div
						class="card bg-base-100 border-base-200 border shadow-sm transition-all duration-300 hover:shadow-md"
					>
						<div class="card-body p-5">
							<div class="flex flex-wrap items-start justify-between gap-3">
								<div>
									<div class="mb-1 flex items-center gap-2">
										<span class="text-lg font-bold">Pedido #{pedido.id}</span>
										<div class={`badge ${statusBadge.class} gap-1`}>
											<statusBadge.icon size={14} />
											{statusBadge.text}
										</div>
									</div>
									<p class="text-base-content/70 flex items-center gap-1 text-sm">
										<Calendar size={14} />
										Data do pedido: {formatDate(pedido.data_pedido)}
									</p>
								</div>

								<div class="flex items-center gap-2">
									<button
										class="btn btn-ghost btn-sm"
										onclick={() => toggleExpanded(pedido.id)}
										aria-label={expanded ? 'Mostrar menos' : 'Mostrar mais'}
									>
										{expanded ? 'Menos detalhes' : 'Ver detalhes'}
										{#if expanded}
											<ChevronUp size={16} />
										{:else}
											<ChevronDown size={16} />
										{/if}
									</button>
								</div>
							</div>

							{#if pedido.veiculo}
								<div class="mt-4 flex flex-col items-start gap-4 sm:flex-row">
									<div class="h-16 w-full overflow-hidden rounded-lg sm:w-24">
										<img
											src={pedido.veiculo.image_link ||
												'https://placehold.co/600x400?text=Sem+Imagem'}
											alt={`${pedido.veiculo.marca} ${pedido.veiculo.modelo}`}
											class="h-full w-full object-cover"
										/>
									</div>
									<div>
										<h3 class="text-primary font-medium">
											{pedido.veiculo.marca}
											{pedido.veiculo.modelo}
										</h3>
										<div class="mt-1 flex flex-wrap gap-2">
											<div class="badge badge-outline badge-sm">{pedido.veiculo.ano}</div>
											<div class="badge badge-outline badge-sm flex items-center gap-1">
												<Car size={12} />
												{pedido.veiculo.placa}
											</div>
										</div>
									</div>
								</div>
							{:else}
								<div class="bg-base-200 mt-4 rounded-lg p-3">
									<p class="text-base-content/70 text-sm italic">
										Informações do veículo não disponíveis
									</p>
								</div>
							{/if}

							{#if expanded}
								<div class="divider my-2"></div>

								<div class="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
									<div class="bg-base-200/50 rounded-lg p-3">
										<h4 class="mb-2 font-medium">Período do Aluguel</h4>
										<div class="grid grid-cols-2 gap-2">
											<div>
												<p class="text-base-content/70 text-xs">Início</p>
												<p>{formatDate(pedido.data_inicio)}</p>
											</div>
											<div>
												<p class="text-base-content/70 text-xs">Fim</p>
												<p>{formatDate(pedido.data_fim)}</p>
											</div>
										</div>
										<p class="mt-2 text-sm font-medium">
											Duração: {calculateDuration(pedido.data_inicio, pedido.data_fim)}
										</p>
									</div>

									<div class="bg-base-200/50 rounded-lg p-3">
										<h4 class="mb-2 font-medium">Observações</h4>
										{#if pedido.observacoes}
											<p class="text-sm">{pedido.observacoes}</p>
										{:else}
											<p class="text-base-content/70 text-sm italic">Nenhuma observação</p>
										{/if}
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{:catch error}
		<div class="alert alert-error">
			<AlertTriangle size={24} />
			<p>Erro ao carregar pedidos: {error.message}</p>
		</div>
	{/await}
</div>
