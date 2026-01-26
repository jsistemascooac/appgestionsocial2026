<script>
	import * as Field from '$lib/components/ui/field/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Pencil } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { cn } from '$lib/utils';

	import { Spinner } from '$lib/components/ui/spinner';
	import { getWFMConfiguracion, updateDatosBeneficiario } from '$lib/api/asociado/solicitud/solicitud_editar.remote';

	let { titulo, flujo, identificacion, nombres, apellidos, idWFMConfiguracion } = $props();

	let editing = $state(1);
	let editar = $derived(editing * (identificacion && nombres && apellidos ? 0 : 1));

	let isEditing = $state(false);
	function toggleEdit() {
		isEditing = !isEditing;
	}
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
					'text-muted-foreground': !identificacion
				})}
			>
				<strong>Identificacion:</strong>
				{identificacion || 'No hay identificacion'} <strong>Nombres:</strong>
				{nombres || 'No hay nombres'} <strong>Apellidos:</strong>
				{apellidos || 'No hay apellidos'}
			</p>
		{:else}
			<form
				{...updateDatosBeneficiario.enhance(async ({ submit }) => {
					try {
						await submit().updates();
						//		form.reset();
						if (updateDatosBeneficiario.result?.success) {
						   toggleEdit();
							toast.success('Se registro el valor correctamente!');
						}
					} catch (e) {
						//	console.error('Error al enviar el formulario:', error);
						toast.error(`Oh no! Algo salio mal,${e},Error interno del servidor`);
					}
				})}
			>
				<input hidden type="text" name="idWFMConfiguracion" value={idWFMConfiguracion} />
				<Field.Set>
					<Field.Field>
						<Field.Label for="identificacion">Identificación</Field.Label>
						<Input name="identificacion" type="text" placeholder="" bind:value={identificacion} />
						<Field.Error>
							{#each updateDatosBeneficiario.fields.identificacion.issues() as issue}
								{issue.message}
							{/each}
						</Field.Error>
						<!-- <Field.Description
          >Digite el numero de identificación.</Field.Description
        > -->
					</Field.Field>
					<Field.Group>
						<Field.Field>
							<Field.Label for="nombres">Nombres</Field.Label>
							<Input name="nombres" type="text" placeholder="" bind:value={nombres} />
							<Field.Error>
								{#each updateDatosBeneficiario.fields.nombres.issues() as issue}
									{issue.message}
								{/each}
							</Field.Error>
							<!--  <Field.Description
          >Digite primer y segundo nombre.</Field.Description
        > -->
						</Field.Field>
						<Field.Field>
							<Field.Label for="apellidos">Apellidos</Field.Label>
							<Input name="apellidos" type="text" placeholder="" bind:value={apellidos} />
							<Field.Error>
								{#each updateDatosBeneficiario.fields.apellidos.issues() as issue}
									{issue.message}
								{/each}
							</Field.Error>
							<!--   <Field.Description
          >Digite primer y segundo apellido.</Field.Description
        > -->
						</Field.Field>
						<Field.Field orientation="horizontal">
							<Button
								type="submit"
								disabled={(updateDatosBeneficiario.pending ? true : false) || editar ? true : false}
							>
								{#if updateDatosBeneficiario.pending}
									<Spinner /> Procesando...
								{:else}
									Actualizar
								{/if}
							</Button>
						</Field.Field>
					</Field.Group>
				</Field.Set>
			</form>
		{/if}
	</Card.Content>
	<!--   <Card.Footer>

</Card.Footer> -->
</Card.Root>
