<script lang="ts">
	import { User, MapPin } from '@lucide/svelte';
	import type { InsertCliente, SelectCliente } from '$lib/server/db/schema';

	let {
		formData = $bindable(),
        enderecoData = $bindable(),
		errors,
		onSubmit,
		isLoading
	}: {
		formData: InsertCliente;
        enderecoData: {
            cep: string;
            rua: string;
            bairro: string;
            cidade: string;
            estado: string;
            numero: string;
			complemento?: string;
        };
		errors: Record<string, string>;
		onSubmit: () => void;
		isLoading?: boolean;
	} = $props();

	const estados = [
		{ value: 'AC', label: 'Acre' },
		{ value: 'AL', label: 'Alagoas' },
		{ value: 'AP', label: 'Amapá' },
		{ value: 'AM', label: 'Amazonas' },
		{ value: 'BA', label: 'Bahia' },
		{ value: 'CE', label: 'Ceará' },
		{ value: 'DF', label: 'Distrito Federal' },
		{ value: 'ES', label: 'Espírito Santo' },
		{ value: 'GO', label: 'Goiás' },
		{ value: 'MA', label: 'Maranhão' },
		{ value: 'MT', label: 'Mato Grosso' },
		{ value: 'MS', label: 'Mato Grosso do Sul' },
		{ value: 'MG', label: 'Minas Gerais' },
		{ value: 'PA', label: 'Pará' },
		{ value: 'PB', label: 'Paraíba' },
		{ value: 'PR', label: 'Paraná' },
		{ value: 'PE', label: 'Pernambuco' },
		{ value: 'PI', label: 'Piauí' },
		{ value: 'RJ', label: 'Rio de Janeiro' },
		{ value: 'RN', label: 'Rio Grande do Norte' },
		{ value: 'RS', label: 'Rio Grande do Sul' },
		{ value: 'RO', label: 'Rondônia' },
		{ value: 'RR', label: 'Roraima' },
		{ value: 'SC', label: 'Santa Catarina' },
		{ value: 'SP', label: 'São Paulo' },
		{ value: 'SE', label: 'Sergipe' },
		{ value: 'TO', label: 'Tocantins' }
	];

	function maskCPF(value: string) {
		return value
			.replace(/\D/g, '')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d{1,2})/, '$1-$2')
			.replace(/(-\d{2})\d+?$/, '$1');
	}

	function maskCEP(value: string) {
		return value
			.replace(/\D/g, '')
			.replace(/(\d{5})(\d)/, '$1-$2')
			.replace(/(-\d{3})\d+?$/, '$1');
	}

	function maskRG(value: string) {
		return value
			.replace(/\D/g, '')
			.replace(/(\d{2})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d{1})/, '$1-$2')
			.replace(/(-\d{1})\d+?$/, '$1');
	}

	function handleCPFInput(event: Event) {
		const target = event.target as HTMLInputElement;
		formData.cpf = maskCPF(target.value);
	}

	function handleRGInput(event: Event) {
		const target = event.target as HTMLInputElement;
		formData.rg = maskRG(target.value);
	}


	function handleCEPInput(event: Event) {
		const target = event.target as HTMLInputElement;
		enderecoData.cep = maskCEP(target.value);
	}

	async function fetchAddressByCEP() {
		const cep = enderecoData.cep.replace(/\D/g, '');
		if (cep.length === 8) {
			try {
				const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
				const data = await response.json();

				if (!data.erro) {
					enderecoData.rua = data.logradouro || '';
					enderecoData.bairro = data.bairro || '';
					enderecoData.cidade = data.localidade || '';
					enderecoData.estado = data.uf || '';
				}
			} catch (error) {
				console.error('Erro ao buscar CEP:', error);
			}
		}
	}
</script>

{#snippet input(props: {
	id: string;
	type: string;
	bind: [any, keyof InsertCliente | keyof typeof enderecoData];
	placeholder: string;
	error: string;
	required: boolean;
	label: string;
	oninput?: (e: Event) => void;
	onblur?: (e: Event) => void;
	colspan?: number;
})}
	<div class="form-control" style="grid-column: span {props.colspan};">
		<label class="label" for={props.id}>
			<span class="label-text font-semibold">{props.label}</span>
		</label>

		<input
			id={props.id}
			type={props.type}
			bind:value={props.bind[0][props.bind[1]]}
			placeholder={props.placeholder}
			class="input input-bordered w-full"
			class:input-error={props.error}
			required={props.required}
			oninput={props.oninput}
			onblur={props.onblur}
		/>

		{#if props.error}
			<label class="label" for={props.id}>
				<span class="label-text-alt text-error">{props.error}</span>
			</label>
		{/if}
	</div>
{/snippet}

<div class="space-y-6">
	<div class="divider">
		<div class="flex items-center gap-2 text-lg font-semibold">
			<User size={20} class="text-primary" />
			Informações Pessoais
		</div>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		{@render input({
			id: 'nome',
			type: 'text',
			bind: [formData, 'nome'],
			placeholder: 'Digite o nome completo',
			error: errors.nome,
			required: true,
			label: 'Nome Completo *'
		})}

		{@render input({
			id: 'cpf',
			type: 'text',
			bind: [formData, 'cpf'],
			placeholder: '000.000.000-00',
			error: errors.cpf,
			required: true,
			label: 'CPF *',
			oninput: handleCPFInput
		})}

		{@render input({
			id: 'profissao',
			type: 'text',
			bind: [formData, 'profissao'],
			placeholder: 'Digite sua profissão',
			error: errors.profissao,
			required: true,
			label: 'Profissão *',
		})}

			{@render input({
			id: 'rg',
			type: 'text',
			bind: [formData, 'rg'],
			placeholder: 'Digite seu RG',
			error: errors.rg,
			required: true,
			label: 'RG *',
			oninput: handleRGInput
		})}
	</div>

	<div class="divider">
		<div class="flex items-center gap-2 text-lg font-semibold">
			<MapPin size={20} class="text-primary" />
			Endereço
		</div>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
		{@render input({
			id: 'cep',
			type: 'text',
			bind: [enderecoData, 'cep'],
			placeholder: '00000-000',
			error: errors.cep,
			required: true,
			label: 'CEP *',
			oninput: handleCEPInput,
			onblur: fetchAddressByCEP
		})}

		<div class="form-control">
			<label class="label" for="estado">
				<span class="label-text font-semibold">Estado *</span>
			</label>
			<select
				id="estado"
				bind:value={enderecoData.estado}
				class="select select-bordered w-full"
				class:select-error={errors.estado}
				required
			>
				<option value="">Selecione o estado</option>
				{#each estados as estado}
					<option value={estado.value}>{estado.label}</option>
				{/each}
			</select>
			{#if errors.estado}
				<label class="label" for="estado">
					<span class="label-text-alt text-error">{errors.estado}</span>
				</label>
			{/if}
		</div>

		{@render input({
			id: 'cidade',
			type: 'text',
			bind: [enderecoData, 'cidade'],
			placeholder: 'Digite a cidade',
			error: errors.cidade,
			required: true,
			label: 'Cidade *'
		})}

		{@render input({
			id: 'rua',
			type: 'text',
			bind: [enderecoData, 'rua'],
			placeholder: 'Digite o nome da rua',
			error: errors.rua,
			required: true,
			label: 'Rua/Logradouro *',
			colspan: 2
		})}

		{@render input({
			id: 'numero',
			type: 'text',
			bind: [enderecoData, 'numero'],
			placeholder: '123',
			error: '',
			required: false,
			label: 'Número'
		})}

		{@render input({
			id: 'bairro',
			type: 'text',
			bind: [enderecoData, 'bairro'],
			placeholder: 'Digite o bairro',
			error: errors.bairro,
			required: true,
			label: 'Bairro *',
			colspan: 2
		})}

		{@render input({
			id: 'complemento',
			type: 'text',
			bind: [enderecoData, 'complemento'],
			placeholder: 'Apto, Bloco, etc.',
			error: '',
			required: false,
			label: 'Complemento'
		})}
	</div>

	<div class="card-actions justify-center pt-6">
		<button type="button" onclick={onSubmit} class="btn btn-primary btn-lg w-full px-12" disabled={isLoading}>
			{#if isLoading}
				<span class="loading loading-spinner loading-sm"></span>
				Cadastrando...
			{:else}
				<User size={20} />
				Finalizar Cadastro
			{/if}
		</button>
	</div>
</div>