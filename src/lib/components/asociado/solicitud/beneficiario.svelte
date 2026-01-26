<script>


	import DatosBeneficiario from './datos-beneficiario.svelte';
	import TipoBeneficiario from './tipo-beneficiario.svelte';

	let {
		titulo,
		flujo,
		tipo,
		identificacion,
		nombres,
		apellidos,
		beneficiarioTipo,
		idWFMConfiguracion,
	} = $props();

	
</script>

			<TipoBeneficiario
				titulo="Tipo de Beneficiario"
				flujo="Defunción"
				{beneficiarioTipo}
				{idWFMConfiguracion}
				
			/>
		<!-- 	<Separator class="my-4" /> -->

			<DatosBeneficiario
				titulo="Beneficiario"
				flujo="Defunción"
				{identificacion}
				{nombres}
				{apellidos}
				{idWFMConfiguracion}
				
			/>
