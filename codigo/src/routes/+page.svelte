<script lang="ts">
	import { listarAutomoveis } from '$lib/client/remote/automovel.remote';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="min-h-screen bg-base-100">
	<!-- Hero Section -->
	<section class="hero min-h-[70vh] bg-base-200" style="background-image: url('https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1470&auto=format&fit=crop'); background-size: cover; background-position: center;">
		<div class="hero-overlay bg-opacity-60"></div>
		<div class="hero-content text-center text-neutral-content">
			<div class="max-w-md">
				<h1 class="mb-5 text-5xl font-bold">Sistema de aluguel PBN</h1>
				<p class="mb-8 text-xl">Sua melhor opção para aluguel de carros. Frota completa, preços competitivos e atendimento personalizado.</p>
				<div class="flex flex-wrap gap-4 justify-center">
					<a href="/login" class="btn btn-primary">Entrar</a>
					<a href="/signup" class="btn btn-outline btn-secondary">Cadastrar</a>
				</div>
			</div>
		</div>
	</section>

	<section class="py-16 px-4">
		<div class="container mx-auto">
			<h2 class="text-3xl font-bold text-center mb-12">Veículos em Destaque</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				{#await listarAutomoveis('')}
					Carregando...
				{:then value}
					{#each value.slice(0,3) as car}
						<div class="card bg-base-100 shadow-xl">
							<figure><img src={car.image_link} alt={car.marca} class="h-48 w-full object-cover" /></figure>
							<div class="card-body">
								<h2 class="card-title">{car.modelo}</h2>
								<div class="card-actions justify-end mt-4">
									<a href="/customer/solicitar" class="btn btn-sm btn-primary">Alugar agora</a>
								</div>
							</div>
						</div>
					{/each}
				{:catch error}
					{error}
				{/await}
			</div>
		</div>
	</section>

	<section class="py-16 px-4">
		<div class="container mx-auto text-center">
			<h2 class="text-3xl font-bold mb-6">Pronto para começar?</h2>
			<p class="text-xl mb-8 max-w-2xl mx-auto">Junte-se aos milhares de clientes satisfeitos e experimente a melhor forma de alugar um veículo.</p>
			<div class="flex flex-wrap gap-4 justify-center">
				<a href="/signup" class="btn btn-primary btn-lg">Criar conta agora</a>
				<a href="/login" class="btn btn-outline btn-secondary btn-lg">Já tenho uma conta</a>
			</div>
		</div>
	</section>


</div>
