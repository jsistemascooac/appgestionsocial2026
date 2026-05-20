<script lang="ts">
	import { updateTipoValidarMovimientoObservacion } from '$lib/api/admin/comite/sepe/solicitud/validar.remote';


	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { toast } from 'svelte-sonner';
	let { idValidarMovimiento, observacion } = $props();

	let observ = $state(observacion);
</script>

<Textarea
	bind:value={observ}
	onblur={async () => {
		try {
		//	alert('Si pasa');
			await updateTipoValidarMovimientoObservacion({
				idValidarMovimiento,
				observacion: observ
			});
			toast.success('Se registro el valor correctamente!');
	/* 		if (updateTipoValidarMovimientoObservacion.result?.success) {
				toast.success('Se registro el valor correctamente!');
			} */
			//toggleEdit();
		} catch (error) {
			toast('Something went wrong!');
		}
	}}
	placeholder="Escribe sus observaciones"
/>
