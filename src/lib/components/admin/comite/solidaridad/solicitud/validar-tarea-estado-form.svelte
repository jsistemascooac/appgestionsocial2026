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
	import { formatCurrency } from '$lib/utils';

	let { tarea_id, valor_asociado, revisado, requerimientos } = $props();

	let valor = $state(valor_asociado);

	let parametro_valor = await getWFValidarTareaParametro(tarea_id);
	//console.log("validar-tarea-form-estado parametro_valor:",parametro_valor,parametro_valor?.tipo,parametro_valor?.parametro )

	let estados = await getWFValidarTareaEstado(tarea_id);


	//let estadoSeleccionado = $state(estados?.find((bt) => bt.default === true)?.id);
	let estadoSeleccionado = $state('');

	let selectedValue = $derived(estados?.find((bt: { id: any }) => bt.id === estadoSeleccionado));

	let valor_asignado = $derived.by(() => {
		console.log("validar-tarea-form-estado valida condicion:",selectedValue?.aprobado )
		if (selectedValue?.aprobado){
			console.log("validar-tarea-form-estado Entro condicion:",parametro_valor.tipo )
		 if (parametro_valor.tipo === 'numero') {
			console.log("validar-tarea-form-estado Entro tipo === 'numero':",parametro_valor.tipo,parametro_valor.parametro )
			return parseInt(parametro_valor.parametro);
		}
		if (parametro_valor.tipo === 'porcentaje') {
			console.log("validar-tarea-form-estado Entro %:",parametro_valor.parametro )
			return parseFloat(parametro_valor.parametro) * valor;
		}
		}
		if (!selectedValue?.aprobado){
			return 0
		}
	});

		// Formateador de moneda colombiana
		const formatter = new Intl.NumberFormat('es-CO', {
		style: 'currency',
		currency: 'COP',
		minimumFractionDigits: 0
	});

	let rawValue = $state(0); // Este será el valor numérico puro

// Efecto para sincronizar el cálculo automático (cuando cambia el estado o el porcentaje)
$effect(() => {
    if (valor_asignado !== undefined) {
        rawValue = valor_asignado;
    }
});

// Derivamos el texto que ve el usuario
let displayValue = $derived(rawValue > 0 ? formatter.format(rawValue) : '');

function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    // Extraer solo números
    const digits = target.value.replace(/\D/g, "");
    const numeric = parseInt(digits) || 0;
    
    // Actualizamos el estado original
    rawValue = numeric;
}
	
 
	//console.log('validar-tarea-form-estado:',estadoSeleccionado,valor_asignado);
</script>

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
					{#if !selectedValue?.aprobado}
					<Label>Los gatos del Asociado es: {(valor_asociado && formatCurrency(valor_asociado)) || 'No hay gatos'}</Label>
					{/if}
					
					<Input
						id="valor"
						disabled={!selectedValue?.aprobado}
						value={displayValue}
						oninput={handleInput}
						  placeholder="$ 0"
					/> 
					<input hidden name="valor" value={rawValue} />
				</div>
				<div class="grid gap-3">
					<Label for="observacion-1">Observacion</Label>

					<Textarea placeholder="Escribe tu comentarios" name="observacion" />
				</div>
			</div>
			{#each updateWFValidarTarea.fields.allIssues() as issue}
				<p>{issue.message}</p>
			{/each}
			 {console.log('Venta Emergent, validar-tarea-form-estado:', valor_asignado)	} 
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
