<script lang="ts">
	import CustomerSidebar from '$lib/client/components/CustomerSidebar.svelte';

	let { children } = $props();

	let isSidebarOpen = $state(false);
</script>

<CustomerSidebar bind:isOpen={isSidebarOpen} />

<div class="transition-all duration-300 md:ml-[280px]">
	{@render children?.()}
</div>
