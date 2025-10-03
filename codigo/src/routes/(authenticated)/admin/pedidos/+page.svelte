<script lang="ts">
	import { formatDate } from '$lib';
	import Kanban from '$lib/client/components/kanban/Kanban.svelte';
	import Loading from '$lib/client/components/Loading.svelte';
	import {
		listarTodosPedidosComCliente,
		atualizarStatusPedido,
	} from '$lib/client/remote/pedido.remote';
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
	import { toast } from 'svelte-sonner';

	type ColumnType = {
		title: string;
		status: SelectPedido['status'];
		visible: boolean;
	};

	let isExpanded: Record<SelectPedido['id'], boolean> = $state({});

	const getStatusBadge = (status: SelectPedido['status']) => {
		switch (status) {
			case 'PENDENTE':
				return { class: 'badge-warning', icon: Clock, text: 'Pendente' };
			case 'CONFIRMADO':
				return { class: 'badge-info', icon: PackageOpen, text: 'Confirmado' };
			case 'CONCLUIDO':
				return { class: 'badge-success', icon: CheckCircle, text: 'Concluído' };
			case 'CANCELADO':
				return { class: 'badge-error', icon: X, text: 'Cancelado' };
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
		isExpanded[id] = !isExpanded[id];
	};

	let isConfirmingPedido: Record<SelectPedido['id'], boolean> = $state({});
	let isRefusingPedido: Record<SelectPedido['id'], boolean> = $state({});

	const confirmarPedido = async (pedidoId: number) => {
		isConfirmingPedido[pedidoId] = true;
		const toastId = toast.loading('Confirmando pedido...');
		try {
			await atualizarStatusPedido({ pedidoId, status: 'CONFIRMADO' });
			toast.success('Pedido confirmado com sucesso!', { id: toastId });
		} catch (error) {
			console.error('Erro ao confirmar pedido:', error);
			toast.error('Erro ao confirmar pedido. Tente novamente.', { id: toastId });
		} finally {
			isConfirmingPedido[pedidoId] = false;
		}
	};

	const recusarPedido = async (pedidoId: number) => {
		isRefusingPedido[pedidoId] = true;
		const toastId = toast.loading('Recusando pedido...');
		try {
			await atualizarStatusPedido({ pedidoId, status: 'CANCELADO' });
			toast.success('Pedido recusado com sucesso!', { id: toastId });
		} catch (error) {
			console.error('Erro ao recusar pedido:', error);
			toast.error('Erro ao recusar pedido. Tente novamente.', { id: toastId });
		} finally {
			isRefusingPedido[pedidoId] = false;
		}
	};

	const columns: ColumnType[] = [
		{
			title: 'Cancelado',
			status: 'CANCELADO',
			visible: false
		},
		{
			title: 'Pendente',
			status: 'PENDENTE',
			visible: true
		},
		{
			title: 'Confirmado',
			status: 'CONFIRMADO',
			visible: true
		},
		{
			title: 'Concluído',
			status: 'CONCLUIDO',
			visible: true
		}
	];
</script>

<div class="container mx-auto px-4">
	<header class="mt-8">
		<h1 class="text-primary flex items-center text-3xl font-bold">
			<FileText class="mr-3" size={28} />
			Gestão de Pedidos
		</h1>
		<p class="text-base-content/70 mt-2"></p>
	</header>

	{#await listarTodosPedidosComCliente()}
		<Loading size="large" />
	{:then pedidos}
		{#if pedidos.length === 0}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<PackageOpen size={64} class="text-base-content/30 mb-4" />
				<h2 class="mb-2 text-2xl font-semibold">Nenhum pedido encontrado</h2>
				<p class="text-base-content/70">Não há pedidos cadastrados no sistema.</p>
			</div>
		{:else}
			<Kanban data={pedidos} key="pedidos" originalCols={columns}>
				{#snippet card(pedido)}
					{@const statusBadge = getStatusBadge(pedido.status)}
					{@const expanded = isExpanded[pedido.id] || false}

					<div
						class="card bg-base-100 border-base-200 border shadow-sm transition-all duration-300 hover:shadow-md"
					>
						<div class="card-body p-3">
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

							{#if pedido.cliente}
								<div class="bg-base-200/50 mt-3 flex items-center gap-2 rounded-lg p-3">
									<User size={16} class="text-base-content/70" />
									<div>
										<p class="text-sm font-medium">{pedido.cliente.nome}</p>
										<p class="text-base-content/70 text-xs">CPF: {pedido.cliente.cpf}</p>
									</div>
								</div>
							{/if}

							{#if pedido.status === 'PENDENTE'}
								<div class="mt-4 flex gap-2">
									<button
										class="btn btn-error btn-sm flex-1"
										disabled={isRefusingPedido[pedido.id]}
										onclick={() => recusarPedido(pedido.id)}
									>
										<X size={16} />
										Recusar
									</button>
									<button
										class="btn btn-success btn-sm flex-1"
										disabled={isConfirmingPedido[pedido.id]}
										onclick={() => confirmarPedido(pedido.id)}
									>
										<Check size={16} />
										Confirmar
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
				{/snippet}
			</Kanban>
		{/if}
	{:catch error}
		<div class="alert alert-error">
			<AlertTriangle size={24} />
			<p>Erro ao carregar pedidos: {error.message}</p>
		</div>
	{/await}
</div>
