import type { ColumnDef } from "@tanstack/table-core";
 import { renderComponent } from "$lib/components/ui/data-table/index.js";
import DataTableActions from "./data-table-actions.svelte";
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type WFMC = {
  id: string;
  solicitud: string;
  proceso:string;
  siguiente:string;
  estado:string;
  responsable: string;
  fecha:Date;
  beneficiario:string

};

 
export const columns: ColumnDef<WFMC>[] = [

  {
    accessorKey: "expand.wf_movimiento.expand.wf_workflow.nombre",
    header: "Solicitud",
  },
  {
    accessorKey: "expand.wf_movimiento.expand.wf_tarea.nombre",
    header: "Proceso",
  },
  {
    accessorKey: "nombres",
    header: "Beneficiario",
  },
  
   {
    accessorKey: "expand.wf_movimiento.expand.wf_tarea.expand.wf_siguiente_tarea.nombre",
    header: "Siguiente",

    
    cell: ({ row }) => {
      const estado = 1//row.getValue('expand'); 
      if(estado){
       
        return `${row.original?.expand.wf_movimiento.expand.wf_estado.wf_estado_siguiente}`; 
        //return `<span class="text-green-600 font-bold">${console.log("DataTable:",row)}</span>`; 
      }
      
     // return renderComponent(DataTableActions, { id: row.original.id });
    },
  },
  {
    accessorKey: "expand.wf_movimiento.expand.wf_estado.nombre",
    header: "Estado",
  },

   {
    accessorKey: "expand.wf_movimiento.expand.wf_tarea.expand.gs_entidad.nombre",
    header: "Responsable",
  },
   {
    accessorKey: "updated",
    header: "Fecha",
  },
 
  
   {
    id: "actions",
    cell: ({ row }) => {
      // You can pass whatever you need from `row.original` to the component
      /**
       * Tienes que trabajar en el query que busque que el asociado pueda editar estando en un estado de ELABORACION, 
       * la tablas wf_estado y wf_tareas, tienen el campo de GS_ENTIDAD por ahi puede ser la solucion
       */
     // console.log("menu.action.table:",row.original.expand.wf_movimiento.expand.wf_workflow.funcionalidad)
 
      return renderComponent(DataTableActions, { id: row.original.expand.wf_movimiento.id,
                                                  funcionalidad:row.original.expand.wf_movimiento.expand.wf_workflow.funcionalidad,
                                                enable:row.original.expand.wf_movimiento.expand.wf_estado.fin });

    },
  },
];