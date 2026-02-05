<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import {
		getWFValidarTareaEstado,
		getWFValidarTareaParametro,
		updateWFValidarTarea
	} from '$lib/api/admin/comite/solidaridad/solicitud/validar.remote';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let { tarea_id, valor_asociado, revisado, requerimientos } = $props();

	let valor = $state(valor_asociado);

	let parametro_valor = await getWFValidarTareaParametro(tarea_id);

	let estados = await getWFValidarTareaEstado(tarea_id);

	//let estadoSeleccionado = $state(estados?.find((bt) => bt.default === true)?.id);
	let estadoSeleccionado = $state('');

	let selectedValue = $derived(estados?.find((bt: { id: any }) => bt.id === estadoSeleccionado));

	let valor_asignado = $derived.by(() => {
		if (selectedValue?.aprobado){
		 if (parametro_valor.tipo === 'numero') {
			return parseInt(parametro_valor.parametro);
		}
		if (parametro_valor.tipo === 'porcentaje') {
			return parseFloat(parametro_valor.parametro) * valor;
		}
		}
		if (!selectedValue?.aprobado){
			return 0
		}
	});

	//console.log('validar-tarea-form-estado:',estadoSeleccionado,valor_asignado);
</script>

<!-- 
<form
	{...updateWFValidarTarea.enhance(async ({ submit }) => {
		try {
			await submit();
			//		form.reset();
			if (updateWFValidarTarea.result?.success) {
				//   toggleEdit();
				toast.success('Se registro el valor correctamente!');
				goto( '/admin/comite/solidaridad/dashboard');
			}
		} catch (e) {
			//	console.error('Error al enviar el formulario:', error);
			toast.error(`Oh no! Algo salio mal,${e}`);
		}
	})}
>
	<div class="flex flex-row items-center gap-2">
	
		<Select.Root
			type="single"
			disabled={revisado / requerimientos !== 1}
			bind:value={estadoSeleccionado}
			name="estado"
		>
			<Select.Trigger>
				{selectedValue ? selectedValue : 'Selecciona un estado'}
			</Select.Trigger>
			<Select.Content>
				{#each estados as { id, nombre }}
					<Select.Item value={id}>{nombre}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<input type="text" hidden name="observacion" />
		{#each updateWFValidarTarea.fields.allIssues() as issue}
			<p>{issue.message}</p>
		{/each}
		<Button type="submit" variant="outline" disabled={revisado / requerimientos !== 1 }
			>Guardar</Button
		>
	</div>
</form> -->

<Dialog.Root>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'outline' })}
		disabled={revisado / requerimientos !== 1}>Cierre</Dialog.Trigger
	>
	<Dialog.Content class="sm:max-w-[425px]">
		<form
			{...updateWFValidarTarea.enhance(async ({ submit }) => {
				try {
					await submit();
					//		form.reset();
					if (updateWFValidarTarea.result?.success) {
						//   toggleEdit();
						toast.success('Se registro el valor correctamente!');
						goto('/admin/comite/solidaridad/dashboard');
					}
				} catch (e) {
					//	console.error('Error al enviar el formulario:', error);
					toast.error(`Oh no! Algo salio mal,${e}`);
				}
			})}
		>
			<Dialog.Header>
				<Dialog.Title>Conclusión del Comite</Dialog.Title>
				<Dialog.Description>
					Conclusion de la solicitud por parte del comite de solidaridad
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4">
				<div class="grid gap-3">
					<Label for="name-1">Estado</Label>
					<Select.Root type="single" bind:value={estadoSeleccionado} name="estado">
						<Select.Trigger>
							{selectedValue?.nombre ? selectedValue?.nombre : 'Selecciona un estado'}
						</Select.Trigger>
						<Select.Content>
							{#each estados as { id, nombre }}
								<Select.Item value={id}>{nombre}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<!-- <Input id="estado-1" name="estado" bind:value={estadoSeleccionado}/> -->
				</div>
				<div class="grid gap-3">
					<Label for="name-1">Valor</Label>
					<Input
						id="valor"
						disabled={!selectedValue?.aprobado}
						name="valor"
						value={valor_asignado}
					/>
				</div>
				<div class="grid gap-3">
					<Label for="observacion-1">Observacion</Label>

					<Textarea placeholder="Escribe tu comentarios" name="observacion" />
				</div>
			</div>
			{#each updateWFValidarTarea.fields.allIssues() as issue}
				<p>{issue.message}</p>
			{/each}
			{console.log('Venta Emergent, validar-tarea-form-estado:', valor_asignado)}
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'outline' })} onclick={() => history.back()}
					>Cancel</Dialog.Close
				>
				<Button type="submit">Guardar</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
