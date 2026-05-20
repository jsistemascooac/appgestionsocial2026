<script lang="ts">
	import { Spinner } from '$lib/components/ui/spinner/index.js';

	import { Button } from '$lib/components/ui/button/index.js';
	import Beneficiario from '$lib/components/asociado/solicitud/beneficiario.svelte';
	import Defuncion from '$lib/components/asociado/solicitud/defuncion.svelte';
	import BancosForm from '$lib/components/asociado/solicitud/bancos-form.svelte';
	import { getContext } from 'svelte';
	import { parseDate } from '@internationalized/date';

	
	import AttachmentForm from '$lib/components/asociado/solicitud/attachment-form.svelte';
	import { toast } from 'svelte-sonner';
	import { deleteSolicitud, getWFMCAnexosTipos, getWFMConfiguracion, getWFMovimientosAnexos, registrarSolicitud } from '$lib/api/asociado/solicitud/solicitud_editar.remote.js';
	//import EsBeneficiario from '$lib/components/asociado/solicitud/es-beneficiario.svelte';
	//import TipoBeneficiario from '$lib/components/asociado/solicitud/tipo-beneficiario.svelte';	


	//	let { data }: PageProps = $props();
	let { data } = $props();

	let paramsWFM = getContext('paramsWFM');

	let isVisible = false;

	// Inherits data from the layout automatically

	/**
	 * Cuando hay dos pendiciones al tiempo a la BD es mejor hacer una Promise ALL
	 */

	const [wfMC, query] = await Promise.all([getWFMConfiguracion(), getWFMCAnexosTipos()]);
	/* 	 let wfMC = await getWFMConfiguracion()
	let query = await getWFMCAnexosTipos()  */
	//let d_wfMC = $derived(wfMCa);

	let esBeneficiario = $derived(wfMC.beneficiario);

	let idSiguienteEstado = wfMC.expand?.wf_movimiento.expand.wf_estado.wf_estado_siguiente;
	//	const query = getWFMCAnexosTipos(data.wf_workflow);

	console.log('Formulario Edicion Defuncion:', data);

	let fallecimiento = $derived( wfMC.fallecimiento ? new Date(wfMC.fallecimiento).toISOString().split('T')[0] :  new Date().toISOString().split('T')[0])

	let value = $state(parseDate(fallecimiento));
	console.log("Defuncion PPAL:",value)
</script>

<!-- {#if wfMC.error}
	<p>oops!</p>
{:else if wfMC.loading}
	<p>loading...</p>
{:else}  -->
{#await getWFMConfiguracion()}
	<Spinner class="size-8" />
{:then wfMC} 
 <h2 class="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
    {wfMC.expand?.wf_movimiento.expand.wf_workflow.nombre} 
  </h2>
	<div class="flex flex-col gap-4 p-4 md:flex-row">
		<div class="flex flex-1 flex-col gap-4">
			{#if esBeneficiario}
				<Beneficiario
					titulo="Datos del beneficiario"
					flujo="Defunción"
					tipo={wfMC.expand?.as_beneficiarios_tipo}
					identificacion={wfMC.identificacion}
					nombres={wfMC.nombres}
					apellidos={wfMC.apellidos}
					beneficiarioTipo={wfMC.as_beneficiarios_tipo}
					idWFMConfiguracion={wfMC.id}
				/>
			{/if}

			<Defuncion
				titulo="Lugar y Fecha del Fallecimiento"
				flujo="Defunción"
				fallecimiento={wfMC.fallecimiento}
				municipio={wfMC.municipio}
				departamento={wfMC.departamento}
				idWFMConfiguracion={wfMC.id}
			/>
			<BancosForm
				flujo="Defunción"
				banco={wfMC.banco}
				numeroCuenta={wfMC.numeroCuenta}
				tipo_cuenta={wfMC.tipo_cuenta}
				idWFMConfiguracion={wfMC.id}
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
			{#await query}
				<Spinner class="size-8" />
			{:then query}
				{#each query as wfCMAnexoTipo}
					{#if !wfCMAnexoTipo.obligatorio && !wfCMAnexoTipo.sepe && wfCMAnexoTipo.as_beneficiario_tipo == wfMC.as_beneficiarios_tipo}
						<AttachmentForm
							anexotipo={wfCMAnexoTipo}
							archivo={await getWFMovimientosAnexos(wfCMAnexoTipo.id)}
						/>
					{:else if !wfCMAnexoTipo.obligatorio && wfCMAnexoTipo.sepe && wfMC.sepe && !wfMC.uso_sepe && !(wfCMAnexoTipo.as_beneficiario_tipo == wfMC.as_beneficiarios_tipo)}
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

<!--   {/if}  -->
