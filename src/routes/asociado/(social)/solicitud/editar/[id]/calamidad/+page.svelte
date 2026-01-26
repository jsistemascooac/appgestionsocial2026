<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	import { getContext } from 'svelte';
//import { confetti } from '@neoconfetti/svelte'
	import {
	deleteSolicitud,
		getWFMCAnexosTipos,
		getWFMConfiguracion,
		getWFMovimientosAnexos,

		registrarSolicitud

	} from '$lib/api/asociado/solicitud/solicitud_editar.remote.js';
	import ValorForm from '$lib/components/asociado/solicitud/valor-form.svelte';
	import BancosForm from '$lib/components/asociado/solicitud/bancos-form.svelte';
	import AttachmentForm from '$lib/components/asociado/solicitud/attachment-form.svelte';
	import { toast } from 'svelte-sonner';

//	let { data }: PageProps = $props();
let { data } = $props();

	let paramsWFM =  getContext('paramsWFM');
		
	let isVisible = false;

	// Inherits data from the layout automatically

	

	/**
	 * Cuando hay dos pendiciones al tiempo a la BD es mejor hacer una Promise ALL
	 */


const [wfMC, query] = await Promise.all([getWFMConfiguracion(), getWFMCAnexosTipos()]);

//	let wfmc = $derived(wfMC);

	let idSiguienteEstado = $state(wfMC.expand?.wf_movimiento.expand.wf_estado.wf_estado_siguiente);

	
	/*		wf_movimiento_configuracion.expand.wf_movimiento.expand.wf_estado.wf_estado_siguiente; */
 
	//	const query = getWFMCAnexosTipos(data.wf_workflow);

	console.log('Formulario Edicion Calamidad:', wfMC);
</script>

{#await wfMC}
	<Spinner class="size-8" />
{:then wf_movimiento_configuracion}
 <h2 class="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
    {wfMC.expand?.wf_movimiento.expand.wf_workflow.nombre} 
  </h2>
	<div class="flex flex-col gap-4 p-4 md:flex-row">
		<div class="flex flex-1 flex-col gap-4">
			<ValorForm 
				titulo= "Presupuesto"
				flujo = "Calamidad"
				valor={wf_movimiento_configuracion.valor}
				idWFMConfiguracion={wf_movimiento_configuracion.id}
				
			/>
			<BancosForm
				flujo = "Calamidad"
				banco={wf_movimiento_configuracion.banco}
				numeroCuenta={wf_movimiento_configuracion.numeroCuenta}
				tipo_cuenta={wf_movimiento_configuracion.tipo_cuenta}
				idWFMConfiguracion={wf_movimiento_configuracion.id}
				
			/>
		</div>

		<div class="flex flex-1 flex-col gap-4">
			{#await query}
				<Spinner class="size-8" />
			{:then query}
				{#each query as wfCMAnexoTipo}
					{#if wfCMAnexoTipo.obligatorio}
						<AttachmentForm
							anexotipo={wfCMAnexoTipo}
						
							archivo={await getWFMovimientosAnexos(wfCMAnexoTipo.id)}
						/>
					{/if}
				{/each}
			{/await}
		</div>
	</div>
	
	<div class="flex w-full items-center justify-between pt-6">
		<form
			{...registrarSolicitud.enhance(async ({ submit }) => {
				try {
					isVisible = false;
					await submit();
					//alert("Entra al submit")
					//		form.reset();
					if (registrarSolicitud.result?.success) {
						isVisible = true;
						toast.success('Se elimino correctamente!');
					}
				} catch (e) {
					//	console.error('Error al enviar el formulario:', error);
					toast.error(`Oh no! Algo salio mal,${e},Error interno del servidor`);
				}
			})}
		>
			<input type="text" name="idSiguienteEstado" hidden bind:value={idSiguienteEstado} />

			{#each registrarSolicitud.fields.idSiguienteEstado.issues() as issue}
				{issue.message}
			{/each}

			{#await paramsWFM}
				<Spinner class="size-8" />
			{:then wfm}
				<Button class={'bg-green-500'} disabled={!wfm.requerimientos.status} type="submit"
					>Enviar</Button
				>
			{/await}
		</form>

		{#await paramsWFM}
			<Spinner class="size-8" />
		{:then wfm}
			<form
				{...deleteSolicitud.enhance(async ({ submit }) => {
					try {
						//	alert("Entra al submit")
						await submit();

						//		form.reset();
					} catch (e) {
						//	console.error('Error al enviar el formulario:', error);
						toast.error(`Oh no! Algo salio mal,${e},Error interno del servidor`);
					}
				})}
			>
				<Button disabled={wfm.requerimientos.status} type="submit">Eliminar</Button>
			</form>

			<!-- 		 {#if isVisible}
			<div>
				<div use:confetti></div>
			</div>
		{/if}  -->
		{/await}
	</div>
{/await}

