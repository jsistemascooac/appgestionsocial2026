import { command, getRequestEvent, query } from '$app/server';
import { error, isRedirect, redirect } from '@sveltejs/kit';
import { asociadoAPISchema } from '$lib/schemas/auth';

export const getUser = query(() => {
	const { cookies } = getRequestEvent();
	return { id: 1, name: 'John Doe', c: cookies.get('pb_auth') };
});

export const getUsuario = query(() => {
	const {  locals, cookies } = getRequestEvent();

	const user = locals.user; // Access the user from locals
//	console.log('llega 0.0', user);
	if (!user) {
	//	console.log('llega 0.1');
	//	redirect(307, '/asociado/login');
	} else {
		try {
			const asociado = cookies.get('asociado')
				? decodeURIComponent(cookies.get('asociado')!)
				: null;
		//	console.log('llega 1.0', asociado);
		 	 if (asociado === null) {
				locals.pb.authStore.clear();
				locals.user = null;
				//         redirect(303, '/https://devgestionsocial.cooaceded.coop/admin/configuracion/movimiento/estado');
			}  
			return asociado;
		} catch (e) {
			console.log('Error al crear la solicitud:', e);
			const status = e instanceof Error && 'status' in e ? (e as any).status : 500;
			error(status, 'Error al crear la solicitud: ' + String(e));
		}
	}

	//console.log("user.remote:",asociado)
});
