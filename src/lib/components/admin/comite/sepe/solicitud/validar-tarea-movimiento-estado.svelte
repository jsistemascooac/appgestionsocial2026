<script lang="ts">
	import { updateTipoValidarMovimientoEstado } from '$lib/api/admin/comite/sepe/solicitud/validar.remote';


	import * as Select from '$lib/components/ui/select/index.js';
	import { toast } from 'svelte-sonner';
	let { idValidarMovimiento,estados, estadoTipo} = $props();


     let tipoSeleccionado =$state(estadoTipo)

/* 	if(estadoTipo===""){
       tipoSeleccionado  = estados?.find((bt: { orden: number; }) => bt.orden === 1)?.id
    } */
 //   let tipoSeleccionado = $derived(estadoTipo);

   


	let selectedValue = $derived(estados?.find((bt: { id: any; }) => bt.id === tipoSeleccionado)?.nombre?? "Selecciona un Estado");

   // console.log("Validar.-estado:",estadoTipo,tipoSeleccionado,idValidarMovimiento)
</script>


<Select.Root type="single" bind:value={tipoSeleccionado}>
	<Select.Trigger>
		{selectedValue ? selectedValue : 'Selecciona un estado'}
	</Select.Trigger>
	<Select.Content
		onclick={async () => {
			try {
				//alert('Si pasa');
			 	await updateTipoValidarMovimientoEstado({
					wf_validar_tareas_movimientos_estado: tipoSeleccionado,
					idValidarMovimiento
				});
			
				//toggleEdit();
			} catch (error) {
				toast('Something went wrong!');
			} 
		}}
	>

		{#each estados as { id, nombre }}
			<Select.Item value={id}>{nombre}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
