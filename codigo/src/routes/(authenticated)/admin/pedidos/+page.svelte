<script lang="ts">
	import { formatDate } from '$lib';
	import { listarTodosPedidosComCliente, atualizarStatusPedido, type listarTodosPedidosComClienteType } from '$lib/client/remote/pedido.remote';
	import type { SelectPedido } from '$lib/server/db/schema';
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
		User,
		Check,
		X
	} from '@lucide/svelte';

	let statusFilter: Exclude<SelectPedido['status'], null> | '' = $state('');

	let isExpanded: Record<SelectPedido['id'], boolean> = $state({});

	let pedidos: listarTodosPedidosComClienteType = $state([]);

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

	const filterOrdersByStatus = (orders: listarTodosPedidosComClienteType) => {
		if (!statusFilter) return orders;
		return orders.filter((order) => order.status === statusFilter);
	};

	const confirmarPedido = async (pedidoId: number) => {
		try {
			await atualizarStatusPedido({ pedidoId, status: 'CONFIRMADO' });
			// Atualizar o status localmente
			pedidos = pedidos.map(pedido =>
				pedido.id === pedidoId ? { ...pedido, status: 'CONFIRMADO' as const } : pedido
			);
		} catch (error) {
			console.error('Erro ao confirmar pedido:', error);
			alert('Erro ao confirmar pedido. Tente novamente.');
		}
	};

	const recusarPedido = async (pedidoId: number) => {
		try {
			await atualizarStatusPedido({ pedidoId, status: 'CONCLUIDO' }); // Usando CONCLUIDO como status de recusa
			// Atualizar o status localmente
			pedidos = pedidos.map(pedido =>
				pedido.id === pedidoId ? { ...pedido, status: 'CONCLUIDO' as const } : pedido
			);
		} catch (error) {
			console.error('Erro ao recusar pedido:', error);
			alert('Erro ao recusar pedido. Tente novamente.');
		}
	};

	const Status: Record<Exclude<SelectPedido['status'], null>, string> = {
		PENDENTE: 'Pendente',
		CONFIRMADO: 'Confirmado',
		CONCLUIDO: 'Concluído'
	};

	const statusOptions = [...Object.entries(Status).map(([value, label]) => ({ value, label }))];
</script>

<div class="container mx-auto px-4 py-8">
	<header class="mb-8">
		<h1 class="text-primary flex items-center text-3xl font-bold">
			<FileText class="mr-3" size={28} />
			Gestão de Pedidos
		</h1>
		<p class="text-base-content/70 mt-2">
			
		</p>
	</header>

	<div class="mb-6 flex flex-wrap items-center gap-4">
		<div class="form-control">
			<label class="label" for="status-filter">
				<span class="label-text">Filtrar por Status</span>
			</label>
			<select class="select select-bordered" id="status-filter" bind:value={statusFilter}>
				<option value="">Todos os status</option>
				{#each statusOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>
	</div>

	{#await listarTodosPedidosComCliente().then(result => pedidos = result)}
		<div class="flex justify-center py-16">
			<div class="loading loading-spinner loading-lg"></div>
		</div>
	{:then _}
		{#if pedidos.length === 0}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<PackageOpen size={64} class="text-base-content/30 mb-4" />
				<h2 class="mb-2 text-2xl font-semibold">Nenhum pedido encontrado</h2>
				<p class="text-base-content/70">Não há pedidos cadastrados no sistema.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each filterOrdersByStatus(pedidos) as pedido}
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
											{pedido.veiculo.marca} {pedido.veiculo.modelo}
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

							{#if pedido.cliente}
								<div class="mt-3 flex items-center gap-2 rounded-lg bg-base-200/50 p-3">
									<User size={16} class="text-base-content/70" />
									<div>
										<p class="text-sm font-medium">{pedido.cliente.nome}</p>
										<p class="text-xs text-base-content/70">CPF: {pedido.cliente.cpf}</p>
									</div>
								</div>
							{/if}

							{#if pedido.status === 'PENDENTE'}
								<div class="mt-4 flex gap-2">
									<button
										class="btn btn-success btn-sm flex-1"
										onclick={() => confirmarPedido(pedido.id)}
									>
										<Check size={16} />
										Confirmar
									</button>
									<button
										class="btn btn-error btn-sm flex-1"
										onclick={() => recusarPedido(pedido.id)}
									>
										<X size={16} />
										Recusar
									</button>
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