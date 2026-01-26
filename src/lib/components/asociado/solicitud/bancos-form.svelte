<script>
	// @ts-nocheck
	import * as Field from '$lib/components/ui/field/index.js';

	import * as Card from '$lib/components/ui/card/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { cn, formatCurrency } from '$lib/utils';
	import { Pencil } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { Spinner } from '$lib/components/ui/spinner';
	import { getWFMConfiguracion, updateBanco } from '$lib/api/asociado/solicitud/solicitud_editar.remote';

	let { flujo, banco, numeroCuenta, tipo_cuenta,idWFMConfiguracion } = $props();

	let editing = $state(true);
	let editar = $derived(editing * (!banco || !numeroCuenta || !tipo_cuenta));

	let isEditing = $state(false);
	function toggleEdit() {
		isEditing = !isEditing;
	}
</script>

<Card.Root class="border {editar ? 'border-red-500' : 'border-green-500'} bg-muted">
	<Card.Header>
		<Card.Title
			><div class="flex items-center justify-between font-medium">
				Datos del banco para transferir
				<Button onclick={toggleEdit} variant="ghost">
					{#if !isEditing}
						<Pencil class="mr-2 size-4" />
						Editar
					{:else}
						Cancelar
					{/if}
				</Button>
			</div></Card.Title
		>
		<!-- <Card.Description>Los gastos incurrido en su proceso de {flujo}</Card.Description> -->
	</Card.Header>
	<Card.Content>
		{#if !isEditing}
			<p
				class={cn('mt-2 text-sm break-all', {
					'text-muted-foreground': !banco
				})}
			>
				Banco: {banco || 'No hay datos del Banco'} Tipo cuenta: {tipo_cuenta ||
					'No hay datos del tipo de cuenta'}
			</p>
			<p
				class={cn('mt-2 text-sm break-all', {
					'text-muted-foreground': !numeroCuenta
				})}
			>
				Numero de cuenta: {numeroCuenta || 'No hay datos de numero cuenta'}
			</p>
		{:else}
			<form
				{...updateBanco.enhance(async ({ submit }) => {
					try {
						await submit();
						//		form.reset();
						if (updateBanco.result?.success) {
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
						<!-- <Field.Legend>Información del Banco</Field.Legend>
						<Field.Description>Datos para hacer la transferencio a su banco.</Field.Description> -->
						<Field.Group>
							<Field.Field>
								<Field.Label for="street">Numero de Cuenta</Field.Label>
								<Input
									name="numeroCuenta"
									placeholder="registre  numero cuenta"
									bind:value={numeroCuenta}
								/>
								<Field.Error>
									{#each updateBanco.fields.valor.issues() as issue}
										{issue.message}
									{/each}
								</Field.Error>
								<Field.Description></Field.Description>
							</Field.Field>
							<div class="grid grid-cols-2 gap-4">
								<Field.Field>
									<Field.Label for="city">Nombre del Banco</Field.Label>
									<Input
										name="banco"
										placeholder="registre el nombre del de Banco"
										bind:value={banco}
									/>
									<Field.Error>
										{#each updateBanco.fields.banco.issues() as issue}
											{issue.message}
										{/each}
									</Field.Error>
									<Field.Description></Field.Description>
								</Field.Field>
								<Field.Field>
									<Field.Label for="zip">Tipo de Cuenta</Field.Label>
									<Input
										name="tipo_cuenta"
										placeholder="registre tipo cuenta"
										bind:value={tipo_cuenta}
									/>
									<Field.Error>
										{#each updateBanco.fields.tipo_cuenta.issues() as issue}
											{issue.message}
										{/each}
									</Field.Error>
									<Field.Description></Field.Description>
								</Field.Field>
							</div>
							<Field.Field orientation="horizontal">
								<Button type="submit" disabled={(updateBanco.pending ? true : false) || editar}>
									{#if updateBanco.pending}
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
	<!-- 	<Card.Footer></Card.Footer> -->
</Card.Root>
