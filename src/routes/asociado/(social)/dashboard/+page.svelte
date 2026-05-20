<script lang="ts">
	//	import DataTable from '$lib/components/data-table.svelte';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { getWFMovimientoConfiguracion } from './dashboard.remote.js';
	import DataTable from './data-table.svelte';
	import { columns } from './columns.js';
	import { formatCurrency } from '$lib/utils.js';
  import * as Sheet from "$lib/components/ui/sheet";

	import SolicitudesStep from '$lib/components/asociado/solicitud/step/solicitudes-step.svelte';
	import { isSheetOpen, selectedId } from '$lib/components/asociado/dashboard/store.js';
	let { data } = $props();

	let asociado = data.asociado;

	//console.log("dashboaard, wfMovimientoConfiguracion:",JSON.parse(data.asociado).identificacion,asociado.identificacion);

	//console.log("dashboaard, data:",wfMovimientoConfiguracion);
</script>

{#if asociado}
	{#if asociado?.nhabilidad > 1}
		<Alert.Root variant="destructive">
			<AlertCircleIcon />
			<Alert.Title>NO puede realizar transacciones en la plataform</Alert.Title>
			<Alert.Description>
				<p>Por favor consulte al area de cartarera e ingrese nuevamente</p>
				<ul class="list-inside list-disc text-sm">
					<li>{asociado.estado}</li>
					<li>{asociado.habilidad}</li>
					<li>Deuda Credito: {formatCurrency(asociado.deuda_credito)}</li>
					<li>Deuda Aporte: {formatCurrency(asociado.deuda_aporte)}</li>
				</ul>
			</Alert.Description>
		</Alert.Root>
	{:else}
		<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<!--  <SectionCards /> 
 	<div class="px-4 lg:px-6">
		<ChartAreaInteractive />
	</div> 
	 <DataTable {data} />  -->

			{#await getWFMovimientoConfiguracion(`${asociado.identificacion}`)}
				<Spinner class="size-8" />
			{:then wfmc}
				{console.log('dashboaard, wfmc:', wfmc)}
				<DataTable data={wfmc} {columns} />


				<!-- El Sheet es global a la página, solo hay UNO -->
				<Sheet.Root bind:open={$isSheetOpen}>
					<Sheet.Content side='bottom'>
						<Sheet.Header>
							<Sheet.Title>Estado de Solicitud</Sheet.Title>
						</Sheet.Header>

						{#if $selectedId}
							<div class="mt-8">
								{console.log("ver Progreso:",$selectedId)}
								<p class="mb-4 text-sm font-bold">ID: {$selectedId.expand?.wf_movimiento.id}</p>
								<!-- Reutilizamos el componente visual de pasos -->
								<SolicitudesStep statusId={$selectedId.estado} />
							</div>
						{/if}
					</Sheet.Content>
				</Sheet.Root>
			{/await}
		</div>
	{/if}
{/if}
