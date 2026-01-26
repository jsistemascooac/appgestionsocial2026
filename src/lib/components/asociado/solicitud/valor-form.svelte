<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Field from '$lib/components/ui/field/index.js';

	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { cn, formatCurrency } from '$lib/utils';

	import { Pencil } from '@lucide/svelte';

	import { toast } from 'svelte-sonner';
	import { Spinner } from '$lib/components/ui/spinner';
	import { getWFMConfiguracion, updateGatos } from '$lib/api/asociado/solicitud/solicitud_editar.remote';

	

	let { titulo,flujo,valor, idWFMConfiguracion } = $props();

	//const { valor } = updateGatos.fields;

	let editing = $state(1);
	let editar = $derived(editing * (valor ? 0 : 1));

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
		<!-- <Card.Description>Valores incurrido en su proceso de {flujo}</Card.Description> -->
	</Card.Header>
	<Card.Content>
		{#if !isEditing}
			<p
				class={cn('mt-2 text-sm break-all', {
					'text-muted-foreground': !valor
				})}
			>
				Total gastos: {(valor && formatCurrency(valor)) || 'No hay gatos'}
			</p>
		{:else}
			<form
				{...updateGatos.enhance(async ({ submit }) => {
					try {
						await submit();
						//		form.reset();
						if (updateGatos.result?.success) {
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
				<div class="w-full max-w-md space-y-6">
					<Field.Set>
						<!-- 	<Field.Legend>Información de Gastos</Field.Legend>
					<Field.Description>Los gastos incurrido en su proceso de salud</Field.Description> -->
						<Field.Group>
							<Field.Field>
								<Field.Label for="street">Total {titulo}</Field.Label>
								<Input
									name="valor"
									placeholder="registre valor total"
									disabled={updateGatos.pending ? true : false}
									bind:value={valor}
								/>
								<Field.Error>
									{#each updateGatos.fields.valor.issues() as issue}
										{issue.message}
									{/each}
								</Field.Error>
								<Field.Description></Field.Description>
							</Field.Field>

							<Field.Field orientation="horizontal">
								<Button
									type="submit"
									disabled={(updateGatos.pending ? true : false) || editar ? true : false}
								>
									{#if updateGatos.pending}
										<Spinner /> Procesando...
									{:else}
										Actualizar
									{/if}
								</Button>
							</Field.Field>
						</Field.Group>
					</Field.Set>
				</div>
			</form>
		{/if}
	</Card.Content>
	<!--   <Card.Footer>
 
  </Card.Footer> -->
</Card.Root>
