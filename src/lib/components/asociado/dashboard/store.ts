// store.ts
import { writable } from 'svelte/store';
export const selectedId = writable<string | null>(null);
export const isSheetOpen = writable(false);
