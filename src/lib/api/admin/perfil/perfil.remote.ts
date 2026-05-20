import { getRequestEvent, query } from "$app/server";
import type { NavMainSchema } from "$lib/schemas/perfil";
import { error } from "@sveltejs/kit";



export const getPerfilesMenusAdmin = query(async () => {
  const { cookies, locals } = getRequestEvent();

  try {
    const perfilesMenusAdmin = await locals.pb.collection('v_perfiles_acceso_menu_usuarios').getFullList<typeof NavMainSchema>({
      filter: `user_id ='${locals.user?.id}'`
    })

   
  //  console.log("getHabilidadDirectivos.remote :", perfilesMenusAdmin)
  return perfilesMenusAdmin
   
  } catch (e) {
    if (e.status === 404) {
      console.warn('Registro no encontrado');
      // No lanzar un error, devolver null o un valor por defecto
      return false
    } else {
      console.log('Error: ', e);
      error(403, { message: 'Error interno del servidor:' + e });
    }

  }
})  
 
