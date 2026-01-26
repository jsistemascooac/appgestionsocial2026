import {  form, getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import * as v from 'valibot';

export const logout = form(v.object({identificacion:v.string()}), async (data)  => {
	const { cookies, locals } = getRequestEvent();

	console.log("Si pasa LOGOUT",data.identificacion)
 	locals.pb.authStore.clear();

 	if (data.identificacion) {
		cookies.delete('asociado', { path: '/' });
		redirect(303, '/asociado/login/'); // Redirect to the login page after logout
	} else {
		redirect(303, '/admin/login/'); // Redirect to the login page after logout
	}  
});
