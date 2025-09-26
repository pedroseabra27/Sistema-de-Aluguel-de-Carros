<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/client/components/Sidebar.svelte';

	let { children } = $props();

	let isSidebarOpen = $state(false);
</script>

<Sidebar bind:isOpen={isSidebarOpen} />

<div class="transition-all duration-300 md:ml-[280px]">
	{@render children?.()}
</div>
