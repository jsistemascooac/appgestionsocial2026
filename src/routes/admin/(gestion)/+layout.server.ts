import type { LayoutServerLoad } from './$types';
import { getUsuario } from '$lib/api/asociado/login/user.remote.js';

export const load = (async ({locals}) => {

	let user = locals.user

	
    return user;
}) satisfies LayoutServerLoad;