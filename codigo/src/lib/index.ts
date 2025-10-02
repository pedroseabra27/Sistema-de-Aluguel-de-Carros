// place files you want to import through the `$lib` alias in this folder.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: number | undefined;

	return (...args: Parameters<T>): void => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = window.setTimeout(() => func(...args), delay);
	};
}

export function formatDate(date: Date | string | undefined | null) {
	if (!date) return 'N/A';
	return new Date(date).toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	});
}
