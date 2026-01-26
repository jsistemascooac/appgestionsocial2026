<script lang="ts">
	
	import { getWorkflowRequerimientos } from '../../../../../../lib/api/asociado/solicitud/solicitud_editar.remote.ts';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { setContext } from 'svelte';
	import { toast } from 'svelte-sonner';

	let { children, data, params } = $props();

	//let loading = $state(0)
	//let wfRequerimeintos = $derived(data.requerimiento)
	let paramsWFM = $derived(getWorkflowRequerimientos());
	
	//let contarRequerimentos = []
	setContext('paramsWFM',paramsWFM);

	//	let req = await paramsWFM;
	//let loading = $derived(wfRequerimeintos.current?.records.length?false:true)
	//loading = wfRequerimeintos
	console.log('Layout Solicitud Edicion:', data);
</script>

{#await (await paramsWFM).requerimientos}
	<Spinner />
{:then wfRequerimeintos}
{console.log("req layout:",wfRequerimeintos)}
	<div class="flex w-[60%] flex-col">
		<div class="flex items-center justify-between text-sm font-medium">
			<span> Completado la solicitud.. </span>
			<span>{Math.round((wfRequerimeintos?.completado / wfRequerimeintos?.registrado) * 100)}%</span
			>
		</div>

		<Progress
			class="shadow-mini-inset relative h-[15px] overflow-hidden rounded-full"
			max={100}
			value={(wfRequerimeintos?.completado / wfRequerimeintos?.registrado) * 100}
		/>

		<span>
			<Sheet.Root>
				<Sheet.Trigger>Que está pendientes?</Sheet.Trigger>
				<Sheet.Content>
					<Sheet.Header>
						<Sheet.Title>Requerimeintos Pendientes</Sheet.Title>
						<Sheet.Description>
							{#if wfRequerimeintos.error}
								<p>oops!</p>
							{:else if wfRequerimeintos.loading}
								<Spinner class="size-8" />
							{:else}
								<h1>Completados:{wfRequerimeintos.completados}</h1>
								<ul>
									{#each wfRequerimeintos.records as { nombre, requerimiento, cantidad, nrequerimeinto }}
										<li>{nombre} req:{requerimiento} can:{cantidad} nre: {nrequerimeinto}</li>
									{/each}
								</ul>
							{/if}
						</Sheet.Description>
					</Sheet.Header>
				</Sheet.Content>
			</Sheet.Root>
		</span>
	</div>
{/await}

  {@render children()}   
