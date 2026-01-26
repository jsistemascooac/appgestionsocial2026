import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}


export function formatCurrency(num: number) {
	if (isNaN(num)) {
		return;
	}
	return new Intl.NumberFormat('es-CO', {
		style: 'currency',
		currency: 'COP',
    minimumFractionDigits: 0, // Ensures no decimal part is displayed
    maximumFractionDigits: 0, // Ensures no decimal part is displayed
	}).format(num);
}




// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
