<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { formatCurrency } from '$lib/utils';
	import { getWFValidarTareaEstado, updateWFValidarTarea } from '$lib/api/admin/administracion/auditoria/solicitud/validar.remote';
	

	let { tarea_id,  revisado, requerimientos } = $props();
 

	console.log("validar-tarea-form-estado parametro_valor:",tarea_id )
	//let parametro_valor = await getWFValidarTareaParametro(tarea_id);
    

	let estados = await getWFValidarTareaEstado(tarea_id);


	//let estadoSeleccionado = $state(estados?.find((bt) => bt.default === true)?.id);
	let estadoSeleccionado = $state('');

	let selectedValue = $derived(estados?.find((bt: { id: any }) => bt.id === estadoSeleccionado));

 
//	console.log('validar-tarea-form-estado:',estadoSeleccionado,valor_asignado);
</script>

<Dialog.Root>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'outline' })}>Cierre</Dialog.Trigger
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
						goto('/admin/administracion/auditoria/dashboard');
					}
				} catch (e) {
					//	console.error('Error al enviar el formulario:', error);
					toast.error(`Oh no! Algo salio mal,${e}`);
				}
			})}
		>
			<Dialog.Header>
				<Dialog.Title>Conclusión de Financial</Dialog.Title>
				<Dialog.Description>
					Conclusion de la solicitud por parte del Area de cartera
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
					
				</div>
			
				<div class="grid gap-3">
					<Label for="observacion-1">Observacion</Label>

					<Textarea placeholder="Escribe tu comentarios" name="observacion" />
				</div>
			</div>
			{#each updateWFValidarTarea.fields.allIssues() as issue}
				<p>{issue.message}</p>
			{/each}
		
			<Dialog.Footer>
				<Dialog.Close
				 type="button" 
				class={buttonVariants({ variant: 'outline' })} 
				onclick={() => history.back()}
					>Cancel</Dialog.Close
				>
				<Button type="submit">Guardar</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
 