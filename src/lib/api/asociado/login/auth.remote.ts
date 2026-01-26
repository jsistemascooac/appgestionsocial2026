// src/lib/server/auth.remote.ts
import { form, getRequestEvent } from '$app/server';
import { error, redirect } from '@sveltejs/kit';
import { loginAdminSchema, loginSchema } from '$lib/schemas/auth';
import * as v from 'valibot'
import { env } from '$env/dynamic/private';

export const login = form(loginSchema, async (data) => {
  //  console.log('Datos recibidos en el servidor:', data);

  // const pb = createPbServer();


  try {
    // Autenticar con PocketBase

    const { cookies, locals } = getRequestEvent();

    const { email, identificacion } = data;
    cookies.set('sessionid', JSON.stringify(data), { path: '/' });
  //  console.log("authenticate.remote",env.PB_GESTIONSOCIAL_IDENTITY, env.PB_GESTIONSOCIAL_PASSWORD,env.API_FINANCIAL_LOCAL)

    const res = await fetch(env.API_FINANCIAL_LOCAL+'/habilidades/?identificacion=' + identificacion);
    const persona = await res.json();
  //  console.log("Persona:", persona[0].email, email);
  /*   
    let test = await locals.pb.send("/hello", {
      // for other options check
      // https://developer.mozilla.org/en-US/docs/Web/API/fetch#options
      query: { "abc": 123 },
  });
  console.log("Login test:", "solo prueba", test) */

    if (persona && (persona[0].email.toLowerCase() === email.toLowerCase())) {
    

      await locals.pb.collection('users').authWithPassword(env.PB_GESTIONSOCIAL_IDENTITY, env.PB_GESTIONSOCIAL_PASSWORD);
    

    //  await locals.pb.collection('sesiones').create({ asociado: persona[0], estado: 'ingreso', token: locals.pb.authStore.token });

      locals.asociado = persona[0];
    //  return { success: true, message: 'Inicio de sesión exitoso' };
   //     console.log("Login:", persona);
    } 

  
 
        } catch (e) {
            console.log('Error: ', e);
            error(403, { message: 'Error interno del servidor:' + e });
        }
 // console.log("Sin Persona:");
  redirect(303, '/asociado/dashboard/');
});



export const loginAdmin = form(loginAdminSchema, async(data) => {
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