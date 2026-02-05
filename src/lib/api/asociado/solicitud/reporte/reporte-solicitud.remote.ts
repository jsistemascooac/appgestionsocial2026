import { command, getRequestEvent, query } from '$app/server';
import ExcelJS from 'exceljs';
import * as v from 'valibot'
import type { WFMC } from '../../../../../routes/asociado/(social)/solicitud/reporte/columns';
import { error } from '@sveltejs/kit';


export const getWFMovimientoConfiguracion = query(v.object({
  month: v.pipe(v.string(), v.nonEmpty('Por favor registre un banco')),
  year: v.pipe(v.string(), v.nonEmpty('Por favor registre un banco'))
}), async ({ month, year }) => {
  const { cookies,locals } = getRequestEvent();
  

  try {
    const wfMovimientoConfiguracion = await locals.pb.collection('wf_movimientos_configuracion').getFullList<WFMC>({
   expand:`wf_movimiento.wf_workflow,wf_movimiento.wf_estado,wf_movimiento.wf_tarea.gs_entidad,
                    wf_movimientos.wf_movimientos_anexos`,
            sort: '-created',
            filter: `wf_movimiento.wf_workflow.wf_tipo.gs_auxilio != "" &&                     
                     strftime('%m', wf_movimiento.updated) = '${month}' && 
                     strftime('%Y', wf_movimiento.updated) = '${year}' `
    })


     
   console.log("dashboar.remote wfMovimientoConfiguracio:",locals.user?.id)
  return (wfMovimientoConfiguracion);
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



export const getWFMovimientoConfiguracionExcel = command(v.object({
  month: v.pipe(v.string(), v.nonEmpty('Por favor registre un banco')),
  year: v.pipe(v.string(), v.nonEmpty('Por favor registre un banco'))
}), async ({ month, year }) => {
  const { cookies,locals } = getRequestEvent();
  

  try {
    const wfMovimientoConfiguracion = await locals.pb.collection('wf_movimientos_configuracion').getFullList<WFMC>({
   expand:`wf_movimiento.wf_workflow,wf_movimiento.wf_estado,wf_movimiento.wf_tarea.gs_entidad,
                    wf_movimientos.wf_movimientos_anexos`,
            sort: '-created',
            filter: `wf_movimiento.wf_workflow.wf_tipo.gs_auxilio != "" &&                     
                     strftime('%m', wf_movimiento.updated) = '${month}' && 
                     strftime('%Y', wf_movimiento.updated) = '${year}' `
    })

console.log("wfMovimientoConfiguracion:",wfMovimientoConfiguracion[0]  )
     const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');
    worksheet.columns = [
        { header: 'ID', key: 'id' },
        { header: 'Nombre', key: 'banco' },
        { header: 'Fecha', key: 'banco' }
    ];

    //console.log("wfMovimientoConfiguracion:",JSON.parse(JSON.stringify(wfMovimientoConfiguracion)));
   // worksheet.addRows(JSON.parse(JSON.stringify(wfMovimientoConfiguracion)));

    // 3. Generar el buffer y retornar la respuesta
     const buffer = await workbook.xlsx.writeBuffer();
    
    const response =  new Response(buffer, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="reporte.xlsx"'
        }
    });
 

   console.log("dashboar.remote wfMovimientoConfiguracio:",response)
  return 1 //response ;
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