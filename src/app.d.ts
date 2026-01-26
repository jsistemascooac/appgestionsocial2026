// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import PocketBase, { type RecordModel } from 'pocketbase'; // Adjust import based on your setup

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			      // pb: El cliente de PocketBase que se reinicia por solicitud
			pb: PocketBase;
			// user: El modelo de usuario autenticado de PocketBase (puede ser nulo si no hay sesión)
            // Utiliza RecordModel o tu tipo User personalizado definido arriba
            user: RecordModel | null; 
			asociado: { } | null;
			regsitrado: { } | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
