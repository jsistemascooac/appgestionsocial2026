<script lang="ts">

	//	import DataTable from '$lib/components/data-table.svelte';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import { Spinner } from "$lib/components/ui/spinner/index.js";
	import { getWFMovimientoConfiguracion, getWFMovimientoConfiguracionExcel } from '../../../../../lib/api/asociado/solicitud/reporte/reporte-solicitud.remote.js';
	import DataTable from './data-table.svelte';
	import { columns } from './columns.js';
	import { formatCurrency } from '$lib/utils.js';

 import * as Field from "$lib/components/ui/field/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
	import { toast } from 'svelte-sonner';

 let month = $state<string>('01');
  let year = $state<string>('2026');



  let wfmc = $derived(getWFMovimientoConfiguracion({month,year}));

  //console.log("reporte +page.svelte wfmc:",await wfmc);
</script>


	  <Field.Group>
      <Field.Set>
         <div class="grid max-w-sm grid-cols-2 gap-4">
            <Field.Field>
              <Field.Label for="checkout-7j9-exp-month-ts6">Mes</Field.Label>
              <Select.Root type="single" bind:value={month}>
                <Select.Trigger id="checkout-7j9-exp-month-ts6">
                  <span>
                    {month || "MM"}
                  </span>
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="01">01</Select.Item>
                  <Select.Item value="02">02</Select.Item>
                  <Select.Item value="03">03</Select.Item>
                  <Select.Item value="04">04</Select.Item>
                  <Select.Item value="05">05</Select.Item>
                  <Select.Item value="06">06</Select.Item>
                  <Select.Item value="07">07</Select.Item>
                  <Select.Item value="08">08</Select.Item>
                  <Select.Item value="09">09</Select.Item>
                  <Select.Item value="10">10</Select.Item>
                  <Select.Item value="11">11</Select.Item>
                  <Select.Item value="12">12</Select.Item>
                </Select.Content>
              </Select.Root>
            </Field.Field>
            <Field.Field>
              <Field.Label for="checkout-7j9-exp-year-f59">Año</Field.Label>
              <Select.Root type="single" bind:value={year}>
                <Select.Trigger id="checkout-7j9-exp-year-f59">
                  <span>
                    {year || "YYYY"}
                  </span>
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="2024">2024</Select.Item>
                  <Select.Item value="2025">2025</Select.Item>
                  <Select.Item value="2026">2026</Select.Item>
                  <Select.Item value="2027">2027</Select.Item>
                  <Select.Item value="2028">2028</Select.Item>
                  <Select.Item value="2029">2029</Select.Item>
                </Select.Content>
              </Select.Root>
            </Field.Field>
     </div>
      </Field.Set>
		</Field.Group>

<button
	onclick={async () => {
		try {
			await getWFMovimientoConfiguracionExcel({month,year});
		} catch (error) {
			toast('Something went wrong!');
		}
	}}
>
	Descargar Excel
</button>

	<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">


 

		<!--  <SectionCards /> 
 	<div class="px-4 lg:px-6">
		<ChartAreaInteractive />
	</div> 
	 <DataTable {data} />  -->

			{#await wfmc}
				<Spinner class="size-8" />
			{:then wfmc}
			{console.log("dashboaard, wfmc:",wfmc)}
				<DataTable data={wfmc} {columns} />
			{/await}
		</div>
