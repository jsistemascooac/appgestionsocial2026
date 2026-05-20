<script lang="ts">
	import SectionCards from '$lib/components/admin/comite/solidaridad/dashboard/section-cards.svelte';
	
	//	import DataTable from '$lib/components/data-table.svelte';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import { Spinner } from "$lib/components/ui/spinner/index.js";
	import { getWFMovimientoConfiguracion, getWFValidarTareas } from '../../../../../../lib/api/admin/comite/solidaridad/dashboard/dashboard.remote.js';
	import DataTable from '$lib/components/admin/comite/solidaridad/dashboard/data-table.svelte';
	import { columns } from '$lib/components/admin/comite/solidaridad/dashboard/columns.js';
	import { columns_edit } from '$lib/components/admin/comite/solidaridad/dashboard/columns_edit.js';
	  import * as Tabs from "$lib/components/ui/tabs/index.js";

	import { formatCurrency } from '$lib/utils.js';



	let {  data } = $props();


  let asociado_inicio=false;
  let asociado_fin=true;
  let asociado='yv87e7yp6ddezg7';

  let comite_inicio=true;
  let comite_fin=false;
  let comite='6ubp7q2uh66o7ky';


   let estado_inicio=false;
  let estado_fin=true;
  


  let estado_revisando='15z38t8510s78v3';
	//console.log("dashboaard, wfMovimientoConfiguracion:",JSON.parse(data.asociado).identificacion,asociado.identificacion);

console.log("dashboaard, data:",data);


</script>

<Tabs.Root value="pendientes" >
  <Tabs.List>
    <Tabs.Trigger value="pendientes">Pendientes</Tabs.Trigger>
    <Tabs.Trigger value="procesando">En Validación</Tabs.Trigger>
	<Tabs.Trigger value="terminada">Terminadas</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="pendientes">
  {#await getWFMovimientoConfiguracion({inicio:asociado_inicio,fin:asociado_fin,entidad:asociado})}
				<Spinner class="size-8" />
			{:then wfmc}
			<!-- {console.log("dashboaard, wfmc:",wfmc)} -->
				<DataTable data={wfmc} {columns} tipo={"add"}/>
			{/await}  
  </Tabs.Content>
  <Tabs.Content value="procesando">
	{#await getWFValidarTareas({inicio:comite_inicio,fin:comite_fin,entidad:comite})}
				<Spinner class="size-8" />
			{:then wfvt}
		<!-- 	{console.log("dashboaard, wfmc:",wfvt)} -->
				<DataTable data={wfvt} columns={columns_edit} tipo={"edit"}/>
			{/await} 
  </Tabs.Content>
   <Tabs.Content value="terminada">
	{#await getWFValidarTareas({inicio:estado_inicio,fin:estado_fin,entidad:comite})}
				<Spinner class="size-8" />
			{:then wfvt}
			<!--  {console.log("dashboaard, wfmc:",wfvt)}  -->
				<DataTable data={wfvt} columns={columns_edit} tipo={"edit"}/>
			{/await} 
  </Tabs.Content>
</Tabs.Root>
