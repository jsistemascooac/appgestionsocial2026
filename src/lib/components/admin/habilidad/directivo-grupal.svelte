<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { toast } from 'svelte-sonner';
	import type { asociadoAPISchema } from '$lib/schemas/auth';
	import { getHabilidadDirectivo } from '$lib/api/admin/habilidad/directivo.remote';
	import * as Item from '$lib/components/ui/item/index.js';
	import { cn, formatCurrency } from '$lib/utils';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	let textAreaValue = $state(''); // Almacena el texto crudo pegado
	let result = $state<any>(null);
let loading = $state(false);

//	console.log('Array de directivo-grupal:', result);
</script>

<h1>Consulta por varias cedulas de asociados</h1>
<div>
	<div>
		<ButtonGroup.Root class="w-1/4">
			<!-- <Input
				placeholder="Buscar por identificación..."
				name="identificacion"
				bind:value={identificacion}
			/> -->
			<Textarea
				bind:value={textAreaValue}
				placeholder="Cedula001&#10;Cedula002&#10;Cedula003"
				rows={10}
				class="w-full border p-2"
			></Textarea>

			<Button variant="outline" size="icon" aria-label="Search" onclick={async()=>{
				try {
					loading = true;
			// IMPORTANTE: Envía un objeto, no el string directo
			result = await getHabilidadDirectivo({ rawIds: textAreaValue });
			loading = false;
			//console.log('Array de directivo-grupal00:', result);
		} catch (e) {
			console.error('Error de validación o red:', e);
		}
			}}>
				<Search />
			</Button>
		</ButtonGroup.Root>
	</div>

	<Separator class="my-4" />
	{#if loading}
			<Spinner />
		{:else}
	<Table.Root>
		<Table.Caption>Listado de asociados por cedula</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[100px]">Identificacion</Table.Head>
				<Table.Head>Asociado</Table.Head>
				<Table.Head>Estado</Table.Head>
				<Table.Head>Habilidad</Table.Head>
				<Table.Head class="text-end">Dias de deuda Aportes</Table.Head>
				<Table.Head class="text-end">Dias de deuda Creditos</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each result as habilidad (habilidad)}
				<Table.Row>
					<Table.Cell class="font-medium">{habilidad.identificacion}</Table.Cell>
					<Table.Cell class={habilidad.nhabilidad !== 1 ? 'text-red-500' : 'text-green-500'}>{habilidad.nombres}</Table.Cell>
					<Table.Cell>{habilidad.estado}</Table.Cell>
					<Table.Cell>{habilidad.habilidad}</Table.Cell>
					<Table.Cell class="text-end">{habilidad.mora_aporte}</Table.Cell>
					<Table.Cell class="text-end">{habilidad.moras_credito}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
		<Table.Footer>
		<!-- 	<Table.Row>
				<Table.Cell colspan={3}>Total</Table.Cell>
				<Table.Cell class="text-end">$2,500.00</Table.Cell>
			</Table.Row> -->
		</Table.Footer>
	</Table.Root>
	{/if}
</div>
