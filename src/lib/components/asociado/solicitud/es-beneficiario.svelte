<script>
// @ts-nocheck

	import * as Card from '$lib/components/ui/card/index.js';
	import * as Field from '$lib/components/ui/field/index.js';

	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { toast } from 'svelte-sonner';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Pencil } from '@lucide/svelte';

	import { cn, formatCurrency } from '$lib/utils';
	import { boolean } from 'zod';

	import { updateEsBeneficiario } from '$lib/api/asociado/solicitud/solicitud_editar.remote';

	let { titulo, flujo, beneficiario, idWFMConfiguracion } = $props();

	let editar =0;

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
	<!-- 	<Card.Description>Es beneficiario en su proceso de {flujo}</Card.Description> -->
	</Card.Header>
	<Card.Content>
		{#if !isEditing}
			<p
				class={cn('mt-2 text-sm break-all', {
					'text-muted-foreground': !beneficiario
				})}
			>
				<Switch disabled="true" id="airplane-mode" bind:checked={beneficiario} /> {beneficiario? 'Sí' : 'No'}
			</p>
		{:else}
			<!-- <input hidden type="text" name="idWFMConfiguracion" value={idWFMConfiguracion} />
			<input type="boolean" name="beneficiario" value={beneficiario} /> -->
			<div class="w-full max-w-md space-y-6">
				<Switch
					id="airplane-mode"
					bind:checked={beneficiario}
					onclick={async () => {
						try {
							await updateEsBeneficiario({idWFMConfiguracion,beneficiario}).updates();
						} catch (error) {
							toast('Something went wrong!');
						}
					}}
				/>
			</div>
		{/if}
	</Card.Content>
	<!--   <Card.Footer>
 
  </Card.Footer> -->
</Card.Root>
