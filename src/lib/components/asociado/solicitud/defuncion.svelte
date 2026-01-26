<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import {   type CalendarDate,   today,DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Pencil } from '@lucide/svelte';
	  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	   import { Label } from "$lib/components/ui/label/index.js";

	
	import { toast } from 'svelte-sonner';
	import { getDepartamentos, getMunicipios, getWFMConfiguracion, updateFallecimeinto } from '$lib/api/asociado/solicitud/solicitud_editar.remote';
	import { Separator } from '$lib/components/ui/separator';

	const df = new DateFormatter('es-CO', {
		dateStyle: 'long'
	});

	let { titulo, flujo, fallecimiento, municipio, departamento, idWFMConfiguracion } = $props();

//	let value = $state<DateValue>(fallecimiento);

	//let value = fallecimiento

	let dept = await getDepartamentos();

	let idDepartamento = $state(departamento ? departamento : 'mpx7h928ybt7iuk');
	let selectedDepartamento = $derived(dept?.find((bt) => bt.id === idDepartamento)?.nombre);

	let idMunicipio = $state(municipio ? municipio : '6t91yfs93xx9nqw');

	let muni = $derived(await getMunicipios(idDepartamento));

	let selectedMunicipio = $derived(muni.items?.find((bt) => bt.id === idMunicipio)?.nombre);

	let editing = $state(1);
	let editar = $derived(editing * (fallecimiento && departamento && municipio ? 0 : 1));

	let isEditing = $state(false);
	function toggleEdit() {
		isEditing = !isEditing;
	}
	let isOpen = $state(false);

 let open = $state(false);

  let value = $state<CalendarDate | undefined>();
	//value = fallecimiento ? parseDate(fallecimiento) : undefined;
  console.log("Defuncion COmponente:",value)
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
			<div class="space-y-2">
				<p>
					<span class="font-medium">Fecha de Fallecimiento:</span>
					{#if fallecimiento}
						{df.format(new Date(fallecimiento))}
					{:else}
						No registrado
					{/if}
				</p>
				<p>
					<span class="font-medium">Lugar del Fallecimiento:</span>
					{#if departamento && municipio}
						{selectedMunicipio}, {selectedDepartamento}
					{:else}
						No registrado
					{/if}
				</p>
			</div>
			{:else}
		<form
			{...updateFallecimeinto.enhance(async ({ submit }) => {
				try {
					await submit().updates(getWFMConfiguracion());
					//		form.reset();
					//alert('Si pasa');
					if (updateFallecimeinto.result?.success) {
						toggleEdit();
						toast.success('Se registro el valor correctamente!');
					}
				} catch (e) {
					//	console.error('Error al enviar el formulario:', error);
					toast.error(`Oh no! Algo salio mal,${e},Error interno del servidor`);
				}
			})}
		>
		<!-- 	<Popover.Root >
				<Popover.Trigger>
					{#snippet child({ props })}
						<Button
							variant="outline"
							class={cn(
								'w-70 justify-start text-start font-normal',
								!value && 'text-muted-foreground'
							)}
							{...props}
						>
							<CalendarIcon class="me-2 size-4" />
							{value ? df.format(value.toDate(getLocalTimeZone())) : 'Seleciona una fecha'}
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0">
					<Calendar
						bind:value
						type="single"
						initialFocus
						captionLayout="dropdown"
					
					/>
				</Popover.Content>
			</Popover.Root> -->

<div class="flex flex-col gap-3">
<!--   <Label for="{idWFMConfiguracion}-date" class="px-1">Date of birth</Label> -->
  <Popover.Root bind:open>
    <Popover.Trigger id="{idWFMConfiguracion}-date">
      {#snippet child({ props })}
        <Button
          {...props}
          variant="outline"
          class="w-48 justify-between font-normal"
        >
          {value
            ? value.toDate(getLocalTimeZone()).toLocaleDateString()
            : "Select date"}
          <ChevronDownIcon />
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-auto overflow-hidden p-0" align="start">
      <Calendar
        type="single"
        bind:value
        captionLayout="dropdown"
        onValueChange={() => {
          open = false;
        }}
        maxValue={today(getLocalTimeZone())}
      /> 
    </Popover.Content>
  </Popover.Root>
{#if fallecimiento}
  <div class="text-sm text-muted-foreground">
	Fecha seleccionada: {fallecimiento}	
  </div>
  {:else}
  {value?value.toDate(getLocalTimeZone()).toLocaleDateString():''}
{/if}
  
</div>
			<input type="date" hidden name="fallecimiento" id="" bind:value />
			<input type="text" hidden name="departamento" id="" bind:value={idDepartamento} />
			<input type="text"  hidden name="municipio" id="" bind:value={idMunicipio} />
			<input type="text"  hidden name="idWFMConfiguracion" id="" bind:value={idWFMConfiguracion} />

  <Separator class="my-4" />
			<div class="w-full max-w-md">
				<Field.Group>
					<Field.Set>
						<Field.Legend>Lugar del Fallecimiento</Field.Legend>
						<!-- 	<Field.Description>All transactions are secure and encrypted</Field.Description> -->

						<div class="grid grid-cols-2 gap-4">
							<Field.Field>
								<Field.Label for="checkout-7j9-exp-month-ts6">Departamento</Field.Label>
								<Select.Root type="single" bind:value={idDepartamento}>
									<Select.Trigger id="checkout-7j9-exp-month-ts6">
										<span>
											{selectedDepartamento}
										</span>
									</Select.Trigger>
									<Select.Content>
										{#await dept}
											loading
										{:then d}
											{#each d as { id, nombre }}
												<Select.Item value={id}>{nombre}</Select.Item>
											{/each}
										{/await}
									</Select.Content>
								</Select.Root>
							</Field.Field>
							<Field.Field>
								<Field.Label for="checkout-7j9-exp-year-f59">Municipio</Field.Label>
								<Select.Root type="single" bind:value={idMunicipio}>
									<Select.Trigger id="checkout-7j9-exp-year-f59">
										<span>
											{selectedMunicipio}
										</span>
									</Select.Trigger>
									<Select.Content>
										{#await muni.items}
											loading
										{:then m}
											{#each m as { id, nombre }}
												<Select.Item value={id}>{nombre}</Select.Item>
											{/each}
										{/await}
									</Select.Content>
								</Select.Root>
							</Field.Field>
						</div>
					</Field.Set>
					<Field.Field orientation="horizontal">
						<Button type="submit">Actualizar</Button>
						<!-- 	<Button variant="outline" type="button">Cancel</Button> -->
					</Field.Field>
				</Field.Group>
			</div>
		</form>
		{/if}
	</Card.Content>
</Card.Root>
