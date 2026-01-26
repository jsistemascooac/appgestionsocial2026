// src/lib/server/auth.remote.ts
import { form, getRequestEvent } from '$app/server';
import { error, redirect } from '@sveltejs/kit';
import { loginAdminSchema } from '$lib/schemas/auth';
import * as v from 'valibot'


export const login = form(loginAdminSchema, async(data) => {
 // console.log("Authenticate server:", phrase);
     const { cookies, locals } = getRequestEvent();

      const { identity, password } = data;

     try {
       await locals.pb.collection('users').authWithPassword(identity, password);

   //   await locals.pb.collection('sesiones').create({ asociado: persona[0], estado: 'ingreso', token: locals.pb.authStore.token });
     } catch (e) {
          console.log('Error: ', e);
            error(403, { message: 'Error interno del servidor:' + e });
     }
      redirect(303, '/admin/directivo/');
/*   if (phrase === 'sveltekit') {
    cookies.set('auth', 'true', { path: '/' });
 //   console.log("Authenticate True:", cookies.get('auth'));
    redirect(307, '/protected');
  } else {
    console.log("Authenticate False:");
    return { success: false, message: 'Frase incorrecta' };
  } */
})