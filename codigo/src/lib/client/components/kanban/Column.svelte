<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import Loading from '../Loading.svelte';

	type Props = {
		data: T[];
		card: Snippet<[T]>;
		title: string;
		isFetching?: boolean;
		config?: {
			maxHeight?: string;
		};
	};

	let {
		title,
		isFetching = $bindable(false),
		card,
		data,
		config = { maxHeight: '78' }
	}: Props = $props();
</script>

<div
	class="card-border card flex w-full flex-col gap-4 bg-base-100 shadow-sm"
	style="max-height: {config.maxHeight}vh"
>
	<h2 class="mt-3 text-center text-lg font-medium">
		{title}
		<span class="ml-1.5 rounded-full border border-primary px-2 py-0.5 text-sm font-medium">
			{#if isFetching}
				<span class="loading loading-xs loading-spinner text-primary">...</span>
			{:else}
				{data.length}
			{/if}
		</span>
	</h2>
	<div class="h-full overflow-y-auto px-3 flex flex-col gap-2">
		{#if data.length === 0}
			<div class="flex h-full items-center justify-center">
				<p class="text-base-content opacity-70">Nenhum item encontrado.</p>
			</div>
		{:else}
			{#each data as data}
				{#if isFetching}
					<div class="flex h-16 items-center justify-center">
						<Loading size="large" />
					</div>
				{:else}
					{@render card(data)}
				{/if}
			{/each}
		{/if}
	</div>
</div>
