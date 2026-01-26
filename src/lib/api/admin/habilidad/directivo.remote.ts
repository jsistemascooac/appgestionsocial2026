import { getRequestEvent, query } from "$app/server";
import { env } from "$env/dynamic/private";
import { asociadoAPISchema } from "$lib/schemas/auth";
import { error } from "@sveltejs/kit";
import * as v from 'valibot';


async function habilidad(identificacion: string) {
  try {
     const res = await fetch(env.API_FINANCIAL_LOCAL + '/habilidades/?identificacion=' + identificacion);
     const h = await res.json()
       return h[0]
  } catch (e) {
    console.log('Error: ', e);
      error(403, { message: 'Error interno del servidor:' + e }); 
  }
 


}


async function procesarApi(tipoAsociados: any[]) {
  const resultados: typeof asociadoAPISchema[] = [];

  for (const tipo of tipoAsociados) {
   // console.log("Asociado:",tipo.identificacion)
    // Simulación de una llamada a API
    const res = await habilidad(tipo.identificacion);
    
    // Adición dinámica al nuevo array
    resultados.push(res );
  }
 // console.log("procesarApi:",resultados)
  return resultados;
}

export const getHabilidadDirectivos = query(async () => {
  const { cookies, locals } = getRequestEvent();
  let hd: [] = []


  try {
    const habilidadDirectivos = await locals.pb.collection('v_asociados_tipos_cargos').getFullList({

      sort: '-identificacion',
      filter: `tipo_asociado ='uwaiguicwsvdosp'`
    })

   
    let hd = await procesarApi(habilidadDirectivos)
    
  
    return hd
  //  console.log("getHabilidadDirectivos.remote :", hd)
   
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
 

});


export const getHabilidadDirectivo = query(v.string(), async (id) => {
//   console.log("Hola llego el ID:",id) 
     const res = await habilidad(id);
	return res
});