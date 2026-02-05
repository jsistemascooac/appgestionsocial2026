import { getRequestEvent, query } from '$app/server';
import * as v from 'valibot'
import type { WFMC } from './columns';
import { error } from '@sveltejs/kit';


export const getWFMovimientoConfiguracion = query(v.object({inicio: v.boolean(),fin:v.boolean(),entidad: v.string()}),async ({inicio,fin,entidad}) => {
  const { cookies,locals } = getRequestEvent();
  

  try {
    const wfMovimientoConfiguracion = await locals.pb.collection('wf_movimientos_configuracion').getFullList<WFMC>({
     expand:`wf_movimiento,wf_movimiento.wf_workflow,wf_movimiento.wf_estado,wf_movimiento.wf_tarea.gs_entidad,wf_movimiento.wf_tarea.wf_siguiente_tarea`,
      sort: 'updated',
      filter: `wf_movimiento.wf_tarea.gs_entidad = "${entidad}" && wf_movimiento.wf_estado.inicio=${inicio} && wf_movimiento.wf_estado.fin=${fin}`,
      requestKey: null //para evitar que se canclele las peticiones automativas de sveltekit
    })

 //  console.log("dashboar.remote wfMovimientoConfiguracio:",locals.user?.id)
  return wfMovimientoConfiguracion 
  } catch (e) {
      if (!e.isAbort) {
        console.error('Error real de red o servidor:', e);
    }
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



export const getWFValidarTareas = query(v.object({inicio: v.boolean(),fin:v.boolean(),entidad: v.string()}),async ({inicio,fin,entidad}) => {
  const { cookies,locals } = getRequestEvent();
  

  try {
    const  wfValidarTareas = await locals.pb.collection('wf_validar_tareas').getFullList<WFMC>({
     expand:`wf_movimiento,wf_movimiento.wf_workflow,wf_movimiento.wf_estado,wf_movimiento.wf_tarea.gs_entidad,wf_movimiento.wf_tarea.wf_siguiente_tarea`,
      sort: 'created',
      filter: `wf_movimiento.wf_tarea.gs_entidad = "${entidad}" && wf_movimiento.wf_estado.inicio=${inicio} && wf_movimiento.wf_estado.fin=${fin}`,
      requestKey: null //para evitar que se canclele las peticiones automativas de sveltekit
    })

 //  console.log("dashboar.remote wfMovimientoConfiguracio:",locals.user?.id)
  return wfValidarTareas 
  } catch (e) {
      if (!e.isAbort) {
        console.error('Error real de red o servidor:', e);
    }
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