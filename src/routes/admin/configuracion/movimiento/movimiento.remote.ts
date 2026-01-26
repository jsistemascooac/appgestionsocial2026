import { getRequestEvent, query } from '$app/server';
import * as v from 'valibot'
import { error } from 'console';


export const getAdminWFMovimientoEstado = query(async () => {
  const { cookies,locals } = getRequestEvent();
  

  try {
    const adminWFMovimientoEstado = await locals.pb.collection('wf_estados').getFullList({
     expand:`wf_workflow,wf_tarea,wf_estado_siguiente,wf_estado_siguiente_nocumple`,
      sort: '-wf_workflow',      
    })

    console.log("dashboar.remote wfMovimientoConfiguracio:",adminWFMovimientoEstado)
  return adminWFMovimientoEstado 
  } catch (e) {
      if (e.status === 404) {
                console.warn('Registro no encontrado');
                // No lanzar un error, devolver null o un valor por defecto
                return false
            }else{
                console.log('Error: ', e);
                error(403, { message: 'Error interno del servidor:' + e });
            }
    
  }
   
});