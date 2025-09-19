<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-screen items-center justify-center ">
	<div class=" rounded-lg p-8 text-center">
		<h1 class="mb-3 text-4xl font-light">Bem vindo</h1>
		<p class="mb-4 text-5xl font-bold text-primary">{data.session.user.name}</p>
	</div>
</div>
