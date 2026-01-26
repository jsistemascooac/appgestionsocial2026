import { getRequestEvent, query } from '$app/server';
import * as v from 'valibot'
import type { WFMC } from './columns';
import { error } from '@sveltejs/kit';


export const getWFMovimientoConfiguracion = query(v.string(),async (identificacion) => {
  const { cookies,locals } = getRequestEvent();
  

  try {
    const wfMovimientoConfiguracion = await locals.pb.collection('wf_movimientos_configuracion').getFullList<WFMC>({
     expand:`wf_movimiento.wf_workflow,wf_movimiento.wf_estado,wf_movimiento.wf_tarea.gs_entidad,wf_movimiento.wf_tarea.wf_siguiente_tarea`,
      sort: '-created',
      filter: `wf_movimiento.response_api.identificacion = ${identificacion} && user = "${locals.user?.id}"`
    })

   console.log("dashboar.remote wfMovimientoConfiguracio:",locals.user?.id)
  return wfMovimientoConfiguracion 
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