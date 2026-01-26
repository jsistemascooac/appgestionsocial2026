<script lang="ts">
 
	import * as Table from '$lib/components/ui/table/index.js';
  import { Textarea } from "$lib/components/ui/textarea/index.js";
	import { getAdminWFMovimientoEstado } from '../movimiento.remote';
	import { Spinner } from '$lib/components/ui/spinner';
    //let { data } = $props();

	const query = getAdminWFMovimientoEstado() ;
    console.log('solcitudes configuraciones:',query)
</script>

{#await query}
<Spinner class="size-8" />
{:then q} 
<Table.Root>
	<Table.Caption>A list of your recent invoices.</Table.Caption>
	<Table.Header>
		<Table.Row>
	<Table.Head class="w-[100px]">ID</Table.Head>
			<Table.Head class="w-[100px]">Invoice</Table.Head>
			<Table.Head>Status</Table.Head>
			<Table.Head>Method</Table.Head>
			<Table.Head class="text-end">Amount</Table.Head>
	
		</Table.Row>
	</Table.Header>
	<Table.Body>
		 {#each q as {id,nombre,expand,inicio,fin}}
			
			<Table.Row>
				<Table.Cell class="font-medium">{id}</Table.Cell>
				 <Table.Cell class="font-medium">{expand?.wf_workflow?.nombre}</Table.Cell>
				<Table.Cell>{expand?.wf_tarea?.nombre}</Table.Cell> 
				<Table.Cell>{nombre}</Table.Cell>
				 <Table.Cell >{inicio}</Table.Cell> 
				<Table.Cell >{fin}</Table.Cell> 
				<Table.Cell >{expand?.wf_estado_siguiente?.nombre}</Table.Cell> 
	
				
			</Table.Row>
		{/each} -
	</Table.Body>
	<!-- <Table.Footer>
		<Table.Row>
			<Table.Cell colspan={3}>Total</Table.Cell>
			<Table.Cell class="text-end">$2,500.00</Table.Cell>
		</Table.Row>
	</Table.Footer> -->
</Table.Root>
{/await}
	
