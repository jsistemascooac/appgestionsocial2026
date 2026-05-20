<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import { UserCheck } from '@lucide/svelte';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';

	import {
		getWFValidarTarea,
		getWFValidarTareaMovimiento,
		getWFValidarTareaMovimientoEstado,
		updateCheckValidarMovimiento,
		updateWFValidarTarea,

		updateWFValidarTareaFinancial

	} from '$lib/api/admin/comite/solidaridad/solicitud/validar.remote';
	import type { PageProps } from '../../$types';
	import { formatCurrency } from '$lib/utils.js';
	import ValidarTareaMovimientoEstado from '$lib/components/admin/comite/solidaridad/solicitud/validar-tarea-movimiento-estado.svelte';
	import { toast } from 'svelte-sonner';
	import ValidarTareaMovimientosObservacion from '$lib/components/admin/comite/solidaridad/solicitud/validar-tarea-movimientos-observacion.svelte';
	import ValidarTareaMovimientoViewPdf from '$lib/components/admin/comite/solidaridad/solicitud/validar-tarea-movimiento-view-pdf.svelte';
	import ValidarTareaEstadoForm from '$lib/components/admin/comite/solidaridad/solicitud/validar-tarea-estado-form.svelte';
	import { goto } from '$app/navigation';

	let { data }: PageProps = $props();

	let tarea = $derived(await getWFValidarTarea());
	let estados = await getWFValidarTareaMovimientoEstado();

	let query = getWFValidarTareaMovimiento();

	let observacion = $state('');

	let check = $derived(query.current ? query.current?.filter((r) => r.revisado == true) : []);

	function getArchivosDescripcion(archivo: string) {
		let arhvioObj = Object.entries(JSON.parse(archivo));
		let descripcion = arhvioObj.find(([key, value]) => key === 'descripcion')?.[1] ?? '';

		//	console.log('getArchivosDescripcion:', descripcion);
		return descripcion;
	}

	//console.log('Vlidar Comite:', await query);
</script>

{#if tarea.responseAPI}
	{#if tarea.responseAPI.nhabilidad > 1}
		<Alert.Root variant="destructive">
			<AlertCircleIcon />
			<Alert.Title>NO puede realizar transacciones en el sistema de gestión</Alert.Title>
			<Alert.Description>
				<p>Por favor consulte al area de cartera e ingrese nuevamente</p>
				<ul class="list-inside list-disc text-sm">
					<li>
						Nombre: <b>{tarea.responseAPI.nombres}</b> Identificación:<b
							>{tarea.responseAPI.identificacion}</b
						>
					</li>
					<li>
						Email:<b>{tarea.responseAPI.email}</b> Oficina:{tarea.responseAPI.oficina} Habilidad:<b
							>{tarea.responseAPI.habilidad}</b
						>
					</li>
					<li>
						Deuda en aportes: {tarea.responseAPI.deuda_aporte} Deuda en creditos: {tarea.responseAPI
							.deuda_credito}
					</li>
				</ul>

				<ul class="list-inside list-disc text-sm">
					<li>{tarea.responseAPI.estado}</li>
					<li>{tarea.responseAPI.habilidad}</li>
					<li>Deuda Credito: {formatCurrency(tarea.responseAPI.deuda_credito)}</li>
					<li>Deuda Aporte: {formatCurrency(tarea.responseAPI.deuda_aporte)}</li>
				</ul>

				<h2>Actualizacion:{tarea.updated}</h2>

				<ButtonGroup.Root>
					<Button onclick={() => goto('/admin/comite/solidaridad/dashboard')}>Regresar</Button>
					<Button
						onclick={async () => {
							try {
								await updateWFValidarTareaFinancial(tarea.responseAPI.identificacion.toString());
							} catch (error) {
								toast('Something went wrong!');
							}
						}}
					>Actualizar</Button>
				</ButtonGroup.Root>
			</Alert.Description>
		</Alert.Root>
	{:else}
		<div class="mt-2 mb-2 flex flex-col gap-6 border-1">
			<div>
				<h1>{tarea.expand?.wf_tarea.expand.wf_workflow.nombre}</h1>
			</div>
			<Item.Root>
				<Item.Content>
					<Item.Title>Asociado</Item.Title>
					<Item.Description>
						Nombre: <b>{tarea.responseAPI.nombres}</b> Identificación:
						<b>{tarea.responseAPI.identificacion}</b>
						Email:<b>{tarea.responseAPI.email}</b>

						Oficina:{tarea.responseAPI.oficina} Habilidad:<b>{tarea.responseAPI.habilidad}</b>
						Deuda en aportes: {tarea.responseAPI.deuda_aporte} Deuda en creditos: {tarea.responseAPI
							.deuda_credito}
					</Item.Description>
				</Item.Content>
				<Item.Actions>
					<!-- 	<Button variant="outline" size="sm">Abrir</Button> -->
				</Item.Actions>
			</Item.Root>
		</div>

		{#if query.error}
			<p>oops!</p>
		{:else if query.loading}
			<p>loading...</p>
		{:else if query.current}
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Item</Table.Head>
						<Table.Head class="w-100">Descripción</Table.Head>
						<Table.Head>Estado</Table.Head>
						<Table.Head>Revisado</Table.Head>
						<Table.Head>Observación</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each query.current as current}
						{#if current.tipo == 'datos'}
							{#each JSON.parse(current.response) as dato}
								<Table.Row>
									<Table.Cell>{current.wfwtr_nombre}</Table.Cell>
									<Table.Cell>
										{#each Object.entries(dato) as [key, value]}
											<p class="min-w-[200px] break-words whitespace-normal">
												{key}: {key === 'valor' ? formatCurrency(Number(value)) : value}
											</p>
										{/each}
									</Table.Cell>
									<Table.Cell>
										<ValidarTareaMovimientoEstado
											idValidarMovimiento={current.id}
											{estados}
											estadoTipo={current.wf_validar_tareas_movimientos_estado}
										/>
									</Table.Cell>

									<Table.Cell>
										<ValidarTareaMovimientosObservacion
											idValidarMovimiento={current.id}
											observacion={current.observacion}
										/>
									</Table.Cell>
									<input type="text" hidden name="observacion" value={observacion} />
									<Table.Cell>
										<Checkbox
											id="terms"
											class="text-end"
											disabled
											checked={current.revisado}
											onclick={async () => {
												try {
													await updateCheckValidarMovimiento({
														idValidarMovimiento: current.id,
														observacion
													});
												} catch (error) {
													toast('Algo fallo!' + error);
												}
											}}
										/></Table.Cell
									>
								</Table.Row>
							{/each}
						{:else}
							<Table.Row>
								<Table.Cell>{getArchivosDescripcion(current.response)}</Table.Cell>
								<Table.Cell>
									<ValidarTareaMovimientoViewPdf archivo={current.response} /></Table.Cell
								>
								<Table.Cell>
									<ValidarTareaMovimientoEstado
										idValidarMovimiento={current.id}
										{estados}
										estadoTipo={current.wf_validar_tareas_movimientos_estado}
									/>
								</Table.Cell>

								<Table.Cell
									><ValidarTareaMovimientosObservacion
										idValidarMovimiento={current.id}
										observacion={current.observacion}
									/></Table.Cell
								>
								<Table.Cell>
									<Checkbox
										id="terms"
										disabled
										checked={current.revisado}
										onclick={async () => {
											try {
												await updateCheckValidarMovimiento({
													idValidarMovimiento: current.id,
													observacion
												});
											} catch (error) {
												toast('Algo fallo!' + error);
											}
										}}
									/></Table.Cell
								>
							</Table.Row>
						{/if}
					{/each}
				</Table.Body>
				<Table.Footer>
					<Table.Row></Table.Row>
				</Table.Footer>
			</Table.Root>

			<ValidarTareaEstadoForm
				tarea_id={tarea.wf_tarea}
				revisado={check.length}
				valor_asociado={query.current[0].valor}
				requerimientos={query.current.length}
			/>
		{/if}
	{/if}
{/if}
