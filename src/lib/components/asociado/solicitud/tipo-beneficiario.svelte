<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	
	import { cn } from '$lib/utils';

	import { Pencil } from '@lucide/svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { getBeneficiarioTipos, getWFMConfiguracion, updateTipoBeneficiario } from '$lib/api/asociado/solicitud/solicitud_editar.remote';
	


	let { titulo, flujo,  beneficiarioTipo,idWFMConfiguracion } = $props();


	let query = await getBeneficiarioTipos();
	let tipoSeleccionado = $derived(beneficiarioTipo);

	//console.log("beneficiarioTipos:",query)

	let selectedValue = $derived(query?.find((bt) => bt.id === tipoSeleccionado)?.nombre);
	//const { as_beneficiarios_tipo } = updateTipoBeneficiario.fields;

	let editing = $state(1);
	let editar = $derived(
		editing * (beneficiarioTipo ? 0 : 1)
	);

	let isEditing = $state(false);
	function toggleEdit() {
		isEditing = !isEditing;
	}
	//	console.log("beneficiarioTipos:",selectedValue,query)
</script>


	<Card.Root class="border {editar ? 'border-red-500' : 'border-green-500'} bg-muted">
		<Card.Header>
			<Card.Title
				><div class="flex items-center justify-between font-medium">
					{titulo}
					<Button onclick={toggleEdit} variant="ghost">
						{#if !isEditing}
							<Pencil class="mr-2 size-4" />
							Editar
						{:else}
							Cancelar
						{/if}
					</Button>
				</div>
			</Card.Title>
			<!-- <Card.Description>Datos del familiar {flujo}</Card.Description> -->
		</Card.Header>
		<Card.Content>
			{#if !isEditing}
				<p
					class={cn('mt-2 text-sm break-all', {
						'text-muted-foreground': !beneficiarioTipo
					})}
				>
					<strong>Tipo de familiar:</strong> {selectedValue || 'No hay tipo de familiar'}
				</p>
			<!-- 	<p
					class={cn('mt-2 text-sm break-all', {
						'text-muted-foreground': !identificacion
					})}
				>
					<strong>Identificacion:</strong> {identificacion || 'No hay identificacion'} <strong>Nombres:</strong> {nombres || 'No hay nombres'} <strong>Apellidos:</strong> {apellidos || 'No hay apellidos'} 
				</p>
			 -->
			{:else}

{#await query}
	loa
{:then tb} 
	<Select.Root type="single" bind:value={tipoSeleccionado} >
			<Select.Trigger >
				{selectedValue ? selectedValue : 'Selecciona un tipo de familiar'}
			</Select.Trigger>
			<Select.Content
				onclick={async () => {
					try {
					//	alert('Si pasa');
						await updateTipoBeneficiario({
							as_beneficiarios_tipo: tipoSeleccionado,idWFMConfiguracion
						}).updates(getWFMConfiguracion());
						/* await getWFMConfiguracion().refresh(); */
						toggleEdit();
					} catch (error) {
						toast('Something went wrong!');
					}
				}}
			>
				{#each tb as { id, nombre }}
					<Select.Item value={id}>{nombre}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root> 
{/await}
	


{/if}
</Card.Content>
<!--   <Card.Footer>

</Card.Footer> -->
</Card.Root>


