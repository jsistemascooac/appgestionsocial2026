import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	let perfil;
	let user = locals.user;
	//console.log('Layouyt Admin: ', user);
	if (user) {
		try {
			const perfil = await locals.pb.collection('v_perfiles_acceso_menu_usuarios').getFullList({
				filter: `user_id ='${locals.user?.id}'`
			});
         //   console.log('Layouyt Admin Perfil: ', perfil);
			return { user, perfil };
		} catch (e) {
			if (e.status === 404) {
				console.warn('Registro no encontrado');
				// No lanzar un error, devolver null o un valor por defecto
				return false;
			} else {
				console.log('Error: ', e);
				error(403, { message: 'Error interno del servidor:' + e });
			}
		}
	}
}) satisfies LayoutServerLoad;
