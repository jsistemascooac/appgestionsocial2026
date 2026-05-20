import type { ColumnDef } from "@tanstack/table-core";
 import { renderComponent } from "$lib/components/ui/data-table/index.js";
import DataTableActions from "./data-table-actions.svelte";
 import DataTableAsociadoButton from "./data-table-asociado-button.svelte";
    import { createRawSnippet } from "svelte";
  import {
 
   renderSnippet
  } from "$lib/components/ui/data-table/index.js";
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
    accessorKey: "expand.wf_movimiento.response_api.nombres",
  //  header: "Beneficiario",
  //header: "Beneficiario",
           id: "asociado",
    header: ({ column }) =>
        renderComponent(DataTableAsociadoButton, {
          onclick: column.getToggleSortingHandler()
        }),
      cell: ({ row }) => {
       const nombreAsociado = row.getValue("asociado") as string;

    const asociadoSnippet = createRawSnippet<[{ asociado: string }]>((getAsociado) => {
      const { asociado } = getAsociado();
      return {
        render: () => `<div class=>${asociado}</div>`
      };
    });

    return renderSnippet(asociadoSnippet, { asociado: nombreAsociado });
      }

  },
  
 /*   {
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
  }, */
  /* {
    accessorKey: "expand.wf_movimiento.expand.wf_estado.nombre",
    header: "Estado",
  }, */

   {
    accessorKey: "expand.wf_movimiento.expand.wf_tarea.expand.gs_entidad.nombre",
    header: "Responsable",
  },
   {
    accessorKey: "updated",
    header: "Fecha",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updated"));
      
      // Formateador con estándar de Colombia
      const formatted = new Intl.DateTimeFormat('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Bogota'
      }).format(date);

      return formatted;
    },
  },
 
  
   {
    id: "actions",
    cell: ({ row }) => {
      // You can pass whatever you need from `row.original` to the component
      /**
       * Tienes que trabajar en el query que busque que el asociado pueda editar estando en un estado de ELABORACION, 
       * la tablas wf_estado y wf_tareas, tienen el campo de GS_ENTIDAD por ahi puede ser la solucion
       */
    //  console.log("menu.action.table:",row.original.expand)

      return renderComponent(DataTableActions, { id: row.original.expand.wf_movimiento.id,tipo: "add" });

    },
  },
];