<script lang="ts">
	type SizeType = 'small' | 'medium' | 'large';
	type ColorType = 'primary' | 'secondary';
	type SpeedType = 'fast' | 'normal';

	type Props = {
		size?: SizeType;
		color?: ColorType;
		speed?: SpeedType;
		className?: string;
	};

	let { size = 'medium', color = 'primary', speed = 'normal', className = '' }: Props = $props();

	const sizeClasses = {
		small: 'h-4 w-4 border-2',
		medium: 'h-8 w-8 border-4',
		large: 'h-12 w-12 border-4'
	};

	const colorClasses = {
		primary: 'border-t-primary',
		secondary: 'border-t-secondary'
	};

	const speedClasses = {
		fast: 'animate-spin-fast',
		normal: 'animate-spin'
	};

	let sizeClass = sizeClasses[size] || sizeClasses.medium;
	let colorClass = colorClasses[color] || colorClasses.primary;
	let speedClass = speedClasses[speed] || speedClasses.normal;
</script>

<div class="flex h-full items-center justify-center">
	<div
		class="{speedClass} rounded-full {sizeClass} border-base-200 {colorClass} {className}"
		role="status"
		aria-label="Loading"
	>
		<span class="sr-only">Loading...</span>
	</div>
</div>
