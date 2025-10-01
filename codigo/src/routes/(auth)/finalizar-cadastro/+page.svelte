<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { criarCliente } from '$lib/client/remote/cliente.remote';
	import ClienteForm from '$lib/client/components/ClienteForm.svelte';
	import { toast } from 'svelte-sonner';
	import type { InsertCliente } from '$lib/server/db/schema';
	import type { PageData } from './$types';

	let formData: InsertCliente = $state({
		nome: '',
		cpf: '',
		telefone: '',
		rua: '',
		complemento: '',
		email: '',
		rg: '',
		endereco: '',
        profissao: ''
	});

	let enderecoData = $state({
		cep: '',
		rua: '',
		bairro: '',
		cidade: '',
		estado: '',
		numero: '',
		complemento: ''
	});

	const enderecoString = $derived.by(() => {
		const { rua, numero, bairro, cidade, estado, cep } = enderecoData;
		return `${rua}, ${numero} - ${bairro}, ${cidade} - ${estado}, ${cep}`;
	});

	let { data }: { data: PageData } = $props();

	let isLoading = $state(false);
	let errors: Record<string, string> = $state({});

	function validateForm() {
		errors = {};

		if (!formData.nome.trim()) errors.nome = 'Nome é obrigatório';
		if (!formData.cpf.trim()) errors.cpf = 'CPF é obrigatório';
		if (!enderecoData.rua.trim()) errors.rua = 'Rua é obrigatória';
		if (!enderecoData.bairro.trim()) errors.bairro = 'Bairro é obrigatório';
		if (!enderecoData.cidade.trim()) errors.cidade = 'Cidade é obrigatória';
		if (!enderecoData.estado.trim()) errors.estado = 'Estado é obrigatório';
		if (!enderecoData.cep.trim()) errors.cep = 'CEP é obrigatório';
		if (!formData.rg.trim()) errors.rg = 'RG é obrigatório';
		if (!formData.profissao || !formData.profissao.trim()) errors.profissao = 'Profissão é obrigatória';

		if (Object.keys(errors).length > 0) {
			toast.error('Por favor, corrija os erros no formulário.');
		}

		return Object.keys(errors).length === 0;
	}

	async function handleSubmit() {
		if (!validateForm()) return;

		isLoading = true;
		const toastId = toast.loading('Cadastrando...');

		try {
			await criarCliente({ ...formData, email: data.session?.user.email, endereco: enderecoString });

			toast.success('Cadastrado com sucesso!', { id: toastId });

			const route = page.url.searchParams.get('redirectTo') || '/customer/pedido';
			await goto(route);
		} catch (error) {
			console.error('Erro ao cadastrar cliente:', error);
			toast.error('Erro ao cadastrar cliente', { id: toastId });
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="from-primary/10 to-secondary/10 min-h-screen bg-gradient-to-br px-4 py-8">
	<div class="mx-auto max-w-4xl">
		<div class="mb-8 text-center">
			<h1 class="mb-2 text-4xl font-bold">Cadastro de Cliente</h1>
			<p class="text-base-content/60">Complete seus dados para finalizar o cadastro</p>
		</div>

		<div class="card bg-base-100 border-base-300 border shadow-md">
			<div class="card-body">
				<ClienteForm bind:formData bind:enderecoData {errors} onSubmit={handleSubmit} {isLoading} />
			</div>
		</div>

		<div class="mt-8 text-center">
			<p class="text-base-content/50 text-sm">Seus dados estão seguros e protegidos conosco 🔒</p>
		</div>
	</div>
</div>
