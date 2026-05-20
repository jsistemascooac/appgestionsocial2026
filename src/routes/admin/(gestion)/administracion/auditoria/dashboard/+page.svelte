<script lang="ts">
	import SectionCards from '$lib/components/admin/comite/solidaridad/dashboard/section-cards.svelte';
	
	//	import DataTable from '$lib/components/data-table.svelte';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import { Spinner } from "$lib/components/ui/spinner/index.js";

	  import * as Tabs from "$lib/components/ui/tabs/index.js";

	import { formatCurrency } from '$lib/utils.js';
	import { getWFMovimientoConfiguracion, getWFValidarTareas } from '$lib/api/admin/administracion/auditoria/dashboard/dashboard.remote.js';
	import DataTable from '$lib/components/admin/administracion/auditoria/dashboard/data-table.svelte';
	import { columns_edit } from '$lib/components/admin/administracion/auditoria/dashboard/columns_edit.js';
	import { columns } from '$lib/components/admin/administracion/auditoria/dashboard/columns.js';
	



	let {  data } = $props();

  let entidad='n95fr471vm271m2';
  let gestion=''

   let estado_inicio=false;
  let estado_fin=true;
  


  let estado_revisando='15z38t8510s78v3';
	//console.log("dashboaard, wfMovimientoConfiguracion:",await getWFMovimientoConfiguracion({inicio:asociado_inicio,fin:asociado_fin,entidad:comite}));

//console.log("dashboaard, data:",data);


</script>

<Tabs.Root value="pendientes" >                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
  <Tabs.List>
    <Tabs.Trigger value="pendientes">Pendientes</Tabs.Trigger>
    <Tabs.Trigger value="procesando">En Validación</Tabs.Trigger>
	<Tabs.Trigger value="terminada">Terminadas</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="pendientes">
  
	{#await getWFMovimientoConfiguracion({inicio:false,fin:true,entidad})}
				<Spinner class="size-8" />
			{:then wfmc}
			
				<DataTable data={wfmc} {columns} tipo={"add"}/>
			{/await}  
  </Tabs.Content>
   <Tabs.Content value="procesando">
	{#await getWFValidarTareas({inicio:true,fin:false})}
				<Spinner class="size-8" />
			{:then wfvt}
				<DataTable data={wfvt} columns={columns_edit} tipo={"edit"}/>
			{/await} 
  </Tabs.Content>
   <Tabs.Content value="terminada">
	{#await getWFValidarTareas({inicio:estado_inicio,fin:estado_fin})}
				<Spinner class="size-8" />
			{:then wfvt}
				<DataTable data={wfvt} columns={columns_edit} tipo={"edit"}/>
			{/await} 
  </Tabs.Content> 
</Tabs.Root>
