<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		ref: HTMLDialogElement | null;
		children: Snippet;
		size?: 'small' | 'medium' | 'large' | 'largeX' | 'large2x' | 'large3x';
	};

	let { ref = $bindable(null), children, size = 'large' }: Props = $props();

	function getClassSize() {
		switch (size) {
			case 'small':
				return 'max-w-sm';
			case 'medium':
				return 'max-w-md';
			case 'large':
				return 'max-w-lg';
			case 'largeX':
				return 'max-w-xl';
			case 'large2x':
				return 'max-w-2xl';
			case 'large3x':
				return 'max-w-3xl';
		}
	}
</script>

<dialog bind:this={ref} class="modal">
	<div class="modal-box w-11/12 {getClassSize()}">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"> ✕ </button>
		</form>
		<div class="space-y-4">
			{@render children()}
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</div>
</dialog>
