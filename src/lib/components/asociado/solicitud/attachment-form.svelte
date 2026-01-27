<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	

	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	import { Pencil, Upload } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { Spinner } from '$lib/components/ui/spinner';
	import { addAnexo, deleteAnexo } from '$lib/api/asociado/solicitud/solicitud_editar.remote';

	let { anexotipo,  archivo } = $props();

	let IDanexoTipo =  $derived(anexotipo?.id);
	// let fileInput: HTMLFormElement;

	//console.log('Attachemnt:', anexotipo?.id);
	const { wf_movimientos_anexos_tipo, soporte } = addAnexo.fields;
	//const { title, content,file } = addAnexo.fields;
	let file = $derived(archivo);

	let fileInput = $derived(file?file:null) 

	let editing = $state(1);
	//	let editar = $derived(editing * await (archivo.length ? 1 : 0));

	let isEditing = $state(false);
	function toggleEdit() {
		isEditing = !isEditing;
	//	console.log('Attachemnt,toggleEdit:', isEditing);
	}

	//console.log("FileImpunt:",file,fileInput)


</script>

<Card.Root class="border {!file ? 'border-red-500' : 'border-green-500'} bg-muted">
	<Card.Header>
		<Card.Title
			><div class="flex items-center justify-between font-medium">
				Anexo de {anexotipo?.expand?.wf_workflows_anexos_tipo.nombre}
				<Button onclick={toggleEdit} variant="ghost" hidden={file}>
					{#if !isEditing}
						<Pencil class="mr-2 size-4" />
						Editar
					{:else}
						Cancelar
					{/if}
				</Button>
			</div>
		</Card.Title>
	</Card.Header>
	<Card.Content>
		{#if isEditing}
			<form
				{...addAnexo.enhance(async ({ data,submit,form }) => {
					try {
					//	console.log("MIra la Data del Form:",anexotipo?.id,data)
						await submit();
					
							//	alert("Si llega")
						if (addAnexo.result?.success) {
							toggleEdit();
						 	form.reset();
						
					//		{console.log('Attachment, toggleEdit:',fileInput)}
							toast.success('Se registro el valor correctamente!');
						}
					} catch (e) {
						//	console.error('Error al enviar el formulario:', error);
						toast.error(`Oh no! Algo salio mal,${e},Error interno del servidor`);
					}
				})}
				enctype="multipart/form-data"
			>
			<input hidden bind:value={IDanexoTipo} name="wf_movimientos_anexos_tipo" /> 
				<div class="relative">
					<input {...soporte.as('file')} bind:value={fileInput}
					type="file"
					class=" w-full file:hidden text-transparent h-60 bg-transparent border border-slate-300 rounded-md"
					
				/>
					<div
					class="absolute pointer-events-none top-1/2 space-y-2 text-center left-1/2 -translate-x-1/2 -translate-y-1/2"
				>
				<Upload class="w-10 h-10 mx-auto " />
					<div>
						<p class="text-blue-600 capitalize font-semibold text-sm">
							selecciona un archivo o arrastra y suelta!
							
						</p>
						<p class="text-sm"> solo pdf</p>
					</div>
				{#if fileInput!==null}
						<button
							class="px-3 py-2 text-white rounded-md bg-blue-700 capitalize font-semibold pointer-events-auto"
							type="submit"
						>
							{#if addAnexo.pending}
							<Spinner /> Procesando...
								{:else}
								
								Cargar {fileInput} archivo(s)
							{/if}
						</button>
					{/if}
</div>
		
</div>
				<p class="mt-4 text-xs text-muted-foreground">
					Recuerda que el archivo a subir debe tener un tamaño maximo 2M
				</p>
					{#each addAnexo.fields.allIssues() as issue}
						{issue.message}
					{/each}
			</form>
		{:else if file}
			
			<Dialog.Root>
				<form>
					<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}
						>Ver {anexotipo?.expand?.wf_workflows_anexos_tipo.nombre}</Dialog.Trigger
					>
					<Dialog.Content class="sm:max-w-[825px]">
						<Dialog.Header>
							<Dialog.Title>Visualizar Documetno</Dialog.Title>
							<Dialog.Description>
								Make changes to your profile here. Click save when you&apos;re done.
							</Dialog.Description>
						</Dialog.Header>
						<div class="grid gap-4">
							<iframe
								src="https://gestionsocial.cooaceded.coop/pb/api/files/pbc_2951797270/{file.id}/{file.soporte}?token="
								title="Vista de archivos PDF"
								width="100%"
								height="100%"
								style="border: none;"
								
							></iframe>
						</div>
						<Dialog.Footer>
							<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
							<Button
								onclick={async () => {
									try {
										
										await deleteAnexo({ idAnexo: archivo.id, idWFMTipoAnexo: anexotipo.id });
										IDanexoTipo = anexotipo?.id

									} catch (e) {
										toast.error(`Oh no! Algo salio mal,${e},Error interno del servidor`);
									}
								}}
							>
								Eliminar
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</form>
			</Dialog.Root>
		{:else}
		<!-- {console.log("attachment File:",file)} -->
			<p class="mt-2 text-sm text-muted-foreground italic">No hay anexos</p>
		{/if}
	</Card.Content>
</Card.Root>
