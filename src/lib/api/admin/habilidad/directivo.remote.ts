import { getRequestEvent, query } from "$app/server";
import { env } from "$env/dynamic/private";
import { asociadoAPISchema } from "$lib/schemas/auth";
import { error } from "@sveltejs/kit";
import * as v from 'valibot';


async function habilidad(identificacion: string) {
  try {
     const res = await fetch(env.API_FINANCIAL_LOCAL + '/habilidades/?identificacion=' + identificacion);
     const h = await res.json()
     //   console.log("Hola llego el ID habilidad:",h) 
        if(h.length>0){
         //   console.log("Hola llego el ID habilidad 1:",h) 
            return h[0]
        }else{
//console.log("Hola llego el ID habilidad 0:",h) 
            return false
        }
       return h!==undefined?h[0]:0
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


const IdListSchema = v.object({
  rawIds: v.pipe(
    v.string(),
    v.transform((input) => 
      input.split(/[,\n]/)
        .map(id => id.trim())
        .filter(id => id !== "")
    ),
    v.array(v.string(), "Debe haber al menos un ID válido")
  )
});

export const getHabilidadDirectivo = query(IdListSchema, async ({ rawIds }) => {
 //  console.log("Hola llego el ID:",rawIds) 
   const resultados = await Promise.all(
    rawIds.map(async (id) => {
     const res=  await habilidad(id);
      // Supongamos que consultas una API por cada ID
      return res;
    })

    
  );
    // const res = await habilidad(id);
     console.log("Hola llego el ID getHabilidadDirectivo:",resultados) 
	return resultados///res
});