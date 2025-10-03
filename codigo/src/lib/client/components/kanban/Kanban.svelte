<script lang="ts" generics="T extends { status: string | null }">
	import { onMount, type Snippet } from 'svelte';
	import Column from './Column.svelte';

	type Props = {
		data: T[];
		key: string;
		card: Snippet<[T]>;
		originalCols: ColumnType[];
		config?: {
			maxHeight?: string;
		};
		actions?: Snippet;
	};

	let { data, key, card, originalCols, config = { maxHeight: '81' }, actions }: Props = $props();

	type ColumnType = {
		title: string;
		status: T[keyof T];
		visible: boolean;
	};

	const STORAGE_KEY = `${key}-columns`;

	onMount(() => {
		const savedCols = localStorage.getItem(STORAGE_KEY);

		if (savedCols) {
			columns = JSON.parse(savedCols);
		} else {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
		}
	});

	let columns: ColumnType[] = $state([...originalCols]);

	function saveColumnsToStorage() {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
	}

	function toggleAllColumns(visible: boolean) {
		columns = columns.map((col) => ({ ...col, visible }));
		if (!visible) {
			columns = [...columns];
		}
		saveColumnsToStorage();
	}

	function resetToDefaults() {
		columns = [...originalCols];
		saveColumnsToStorage();
	}
</script>

<ul
	class="dropdown menu rounded-box bg-base-100 w-52 shadow-sm"
	popover
	id="popover-5"
	style="position-anchor:--anchor-5"
>
	<div class="border-b-base-200 mb-2 flex flex-col justify-between gap-2 border-b pb-2">
		<button onclick={() => toggleAllColumns(true)} class="btn btn-xs btn-primary">
			Selecionar todos
		</button>
		<button onclick={() => toggleAllColumns(false)} class="btn btn-xs btn-secondary">
			Limpar todos
		</button>
		<button onclick={resetToDefaults} class="btn btn-xs btn-accent"> Restaurar padrão </button>
	</div>
	<div class="flex flex-col gap-2">
		{#each columns as column, i (i)}
			<label class="label">
				<input
					type="checkbox"
					bind:checked={column.visible}
					class="checkbox"
					onchange={saveColumnsToStorage}
				/>
				{column.title}
			</label>
		{/each}
	</div>
</ul>

<div class="mb-4 flex items-center justify-between pt-4">
	<button class="btn btn-primary" popovertarget="popover-5" style="anchor-name:--anchor-5">
		Filtrar colunas
	</button>

	<div class="flex gap-2">
		{@render actions?.()}
	</div>
</div>

<div
	class="grid gap-4"
	style="grid-template-columns: repeat({columns.filter((c) => c.visible === true).length}, 1fr);"
>
	{#if columns.filter((c) => c.visible === true).length === 0}
		<div class="col-span-full text-center text-gray-500">
			Nenhuma coluna visível. Selecione pelo menos uma coluna para exibir.
		</div>
	{:else}
		{#each columns.filter((c) => c.visible === true) as column}
			<Column
				{config}
				title={column.title}
				data={data.filter((data) => data.status === column.status)}
				isFetching={false}
				{card}
			/>
		{/each}
	{/if}
</div>
