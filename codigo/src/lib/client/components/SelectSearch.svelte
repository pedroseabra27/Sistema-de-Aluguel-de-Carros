<script lang="ts" module>
	export type SelectItem<T> = {
		value: (item: T) => string | number;
		label: (item: T) => string;
	};
</script>

<script lang="ts" generics="T">
	import { Check } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import Loading from './Loading.svelte';

	interface Props {
		config: SelectItem<T>;
		value: string | number;
		placeholder?: string;
		delegateQuery: () => Promise<T[]>;
		disabled?: boolean;
		componentId?: string;
	}

	let { config, value = $bindable(), placeholder, delegateQuery, disabled, componentId = '1' }: Props = $props();

	let inputRef = $state<HTMLInputElement | null>(null);
	let popoverRef = $state<HTMLElement | null>(null);
	let searchTerm = $state('');
	let options: T[] = $state([]);
	let isLoading = $state(true);

	const selectedValue = $derived.by(() => {
		const selectedItem = options.find((item) => String(config.value(item)) === value);
		return selectedItem ? config.label(selectedItem) : value;
	});

	function toggleDropdown() {
		if (!disabled) {
			loadOptions();
		}
	}

	async function loadOptions() {
		try {
			if (options.length === 0) {
				options = await delegateQuery();
			}
		} catch (error: any) {
			console.error(error.message);
			toast.error('Erro ao carregar opções');
		} finally {
			isLoading = false;
		}
	}

	function selectOption(optionValue: string) {
		value = optionValue;
		searchTerm = '';
		if (popoverRef) {
			popoverRef.hidePopover();
		}
	}

	const filteredOptions = $derived.by(() => {
		if (!searchTerm) return options;
		return options.filter((option) =>
			config.label(option).toLowerCase().includes(searchTerm.toLowerCase())
		);
	});
</script>

<button
	class="select select-bordered"
	popovertarget="popover-{componentId}"
	style="anchor-name:--anchor-{componentId}"
	{disabled}
	onclick={toggleDropdown}
>
	{selectedValue || `Selecione ${placeholder}...`}
</button>

<div
	class="dropdown menu rounded-box bg-base-100 max-h-64 w-52 shadow-sm"
	popover
	id="popover-{componentId}"
	style="position-anchor:--anchor-{componentId}"
	bind:this={popoverRef}
>
	<div class=" sticky top-0 z-20">
		<div class="join w-full">
			<input
				bind:this={inputRef}
				bind:value={searchTerm}
				placeholder={`Pesquise ${placeholder}...`}
				class="input join-item input-sm w-full"
			/>
		</div>
	</div>

	{#if isLoading}
		<div class="flex items-center justify-center p-4">
			<Loading />
		</div>
	{:else}
		<ul role="listbox">
			<li>
				<button
					class="hover:bg-base-300 mt-2 flex w-full items-center rounded-lg p-2 text-left"
					onclick={() => selectOption('')}
					role="option"
					aria-selected={value === ''}
				>
					<Check class="mr-2 size-4 {value !== '' ? 'opacity-0' : 'text-primary'}" />
					<span>Nenhum</span>
				</button>
			</li>

			<div class="divider my-1"></div>

			{#if filteredOptions.length === 0 && !isLoading}
				<li class="text-base-content/70 p-2">Nenhum encontrado.</li>
			{/if}

			{#each filteredOptions as option}
				<button
					class="hover:bg-base-300 flex w-full items-center rounded-lg p-2 text-left"
					onclick={() => selectOption(String(config.value(option)))}
					role="option"
					aria-selected={value === String(config.value(option))}
				>
					<Check
						class="mr-2 size-4 {value !== String(config.value(option))
							? 'opacity-0'
							: 'text-primary'}"
					/>
					<span>{config.label(option)}</span>
				</button>
			{/each}
		</ul>
	{/if}
</div>
