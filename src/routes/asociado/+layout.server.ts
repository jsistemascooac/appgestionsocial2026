import type { LayoutServerLoad } from './$types';
import { getUsuario } from '$lib/api/asociado/login/user.remote.js';

export const load = (async () => {

	let cookiesasociado = await getUsuario();

	let asociado = JSON.parse(cookiesasociado ? cookiesasociado : 'null');
    return {asociado};
}) satisfies LayoutServerLoad;