// src/hooks.server.ts
import { createPbServer } from '$lib/server/db/pocketbase';
import { redirect, type HandleValidationError } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
import { toast } from 'svelte-sonner';

export const handleValidationError: HandleValidationError = ({ event, issues }) => {
	console.log('Validation issues:', issues);
	return {
		message: 'Nice try, hacker!'
	};
};

// Define a handle hook specific for PocketBase
export const handle: Handle = async ({ event, resolve }) => {
	// Initialize PocketBase instance and attach to locals

	event.locals.pb = createPbServer();
	//event.locals.asociado = null;

	// Load authStore from cookies
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	// console.log("token PBXYZ1", await event.request.formData())
	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)

		event.locals.pb.authStore.isValid && (await event.locals.pb.collection('users').authRefresh({expand:'perfil'}));
		// console.log('Hooks:', event.locals.pb.authStore.model  );
		event.locals.user = structuredClone(event.locals.pb.authStore.model);
		//  event.locals.regsitrado = event.locals.asociado;

		/*    const asociado =  await event.locals.pb.collection('asociados').getFirstListItem(`token = "${event.locals.pb.authStore.token}"`);
         console.log('token PBXYZ9:', asociado  );
  */
		//   console.log('token PBXYZ9:', event.locals.asociado  );
		// event.locals.pb.authStore.isValid &&
		//   await event.locals.pb.collection('users').authRefresh();
		//       console.log("token PBXYZ2",event.locals.pb.authStore)
		//   await event.locals.pb.collection('users').authRefresh();
		//   console.log('Refreshed user:', event.locals.user);
		//  event.locals.user = structuredClone(event.locals.pb.authStore.model);
		//   event.locals.user = event.locals.pb.authStore.isValid ? { ...event.locals.pb.authStore.model } : undefined;
		// }
	} catch (_) {
		// Clear authStore if refresh fails
		console.log('Mal Refreshed user:', event.locals.pb);
		event.locals.pb.authStore.clear();
		event.locals.user = null;
	}
	//   console.log('Hook:', event.url.pathname);
	if (
		event.url.pathname.startsWith('/asociado') &&
		!event.locals.user &&
		!['/asociado/login', '/asociado/register'].includes(event.url.pathname)
	) {
		console.log('Redirigiendo a login');
		redirect(303, '/asociado/login');
	}

if (
		event.url.pathname.startsWith('/admin') &&
		!event.locals.user &&
		!['/admin/login', '/admin/register'].includes(event.url.pathname)
	) {
		console.log('Redirigiendo a login');
		redirect(303, '/admin/login');
	}


	/*
	 *Configuramos para que el asociado no pueda entrar a una ruta diiferente Asociado
	 */


     // console.log("hook...GSAMIN")
	 		if (event.locals.user?.username === 'gsasociado' &&
				!event.url.pathname.startsWith('/asociado/') &&
				!['/login', '/register'].includes(event.url.pathname)
			) {
				toast.error('NO tienen acceso a la ruta indicada');
			//	console.log(event.locals.user);
          redirect(303,'/asociado/dashboard')
			} else if (
				event.locals.user?.perfil.id === 'eod2xt47ox6wjh2' &&
				!event.url.pathname.startsWith('/admin/') &&
				!['/admin/login', '/register'].includes(event.url.pathname)
			) {
				toast.error('NO tienen acceso a la ruta indicada');
			//	console.log(event.locals.user);
			         redirect(303,'/admin/dashboard')
			} 
	

	/*   if( event.locals.user?.username==='gsadmin'  &&
        !event.url.pathname.startsWith('/asociado/') &&
        !['/login','/register'].includes(event.url.pathname)
        ){
          toast.error('NO tienen acceso a la ruta indicada')
          console.log(event.locals.user);
   //         redirect(303,'/asociado/dashboard')
        } 

        if( event.locals.user?.perfil.id==='eod2xt47ox6wjh2'  &&
        !event.url.pathname.startsWith('/admin/') &&
        !['/admin/login','/register'].includes(event.url.pathname)
        ){
          toast.error('NO tienen acceso a la ruta indicada')
          console.log(event.locals.user);
   //         redirect(303,'/asociado/dashboard')
        }  */

	//   event.locals.asociado = event.cookies.get('asociado') ? JSON.parse(decodeURIComponent(event.cookies.get('asociado'))) : null;
	// Proceed with SvelteKit's default handling

	//  console.log("token PBXYZ1",event.locals.asociado)
	const response = await resolve(event);

	// Export authStore to cookie for subsequent requests
	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie());

	if (event.locals.asociado) {
		//   console.log("token PBXYZ3",event.locals.asociado)
		//  event.locals.regsitrado = cookies.get('asociado') ? JSON.parse(decodeURIComponent(cookies.get('asociado'))) : null;
		response.headers.append(
			'set-cookie',
			`asociado=${encodeURIComponent(JSON.stringify(event.locals.asociado))}; Path=/; HttpOnly; Max-Age=${60 * 60 * 1 * 1}`
		);
	}

	return response;
};
