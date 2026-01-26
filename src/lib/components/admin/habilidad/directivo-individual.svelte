<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
  import { Spinner } from "$lib/components/ui/spinner/index.js";
	import { toast } from 'svelte-sonner';
	import type { asociadoAPISchema } from '$lib/schemas/auth';
	import { getHabilidadDirectivo } from '$lib/api/admin/habilidad/directivo.remote';
	import * as Item from '$lib/components/ui/item/index.js';
    import { cn, formatCurrency } from '$lib/utils';

	let loading = false;
	let identificacion = '';
	let habilidad: (typeof asociadoAPISchema)[] = [];
    
</script>

<h1>Consulta por asociado</h1>
<div>
	<div>
		<ButtonGroup.Root class="w-1/4">
			<Input
				placeholder="Buscar por identificación..."
				name="identificacion"
				bind:value={identificacion}
			/>
			<Button
				variant="outline"
				size="icon"
				aria-label="Search"
				onclick={async () => {
					try {
						loading = true;
						habilidad = await getHabilidadDirectivo(identificacion);
                        loading = false
                        identificacion=''
						//console.log('Datos respuesta:', habilidad);
						//  toast("La respuesta de RF:",res.r)
					} catch (error) {
						toast('Something went wrong!');
					}
				}}
			>
				<Search />
			</Button>
		</ButtonGroup.Root>
	</div>
	<Separator class="my-4" />
	<div>
		{#if loading }
			<Spinner />
		{:else}
			{#await habilidad}
				<Spinner />
			{:then h}
				<div class="flex flex-col gap-6">
					<Item.Root>
						<Item.Content>
							Asociado:
							<Item.Title class={h.nhabilidad!==1?"text-red-500":"text-green-500"}>{h.nombres}</Item.Title>
							<Item.Description>
								
                                {h.identificacion}
                                {h.habilidad}
							</Item.Description>
						</Item.Content>
					</Item.Root>
					<Item.Root variant="outline">
						<Item.Content>
							<Item.Title>Deudas</Item.Title>
							<Item.Description>
							
									Aporte: {formatCurrency(h.deuda_aporte)}
							
									Credito: {formatCurrency(h.deuda_credito)}
								
							</Item.Description>
						</Item.Content>
					</Item.Root>
				</div>
			{/await}
		{/if}
	</div>
</div>
