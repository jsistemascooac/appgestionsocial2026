<script lang="ts">

 import * as Table from "$lib/components/ui/table/index.js";
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { getHabilidadDirectivos } from "$lib/api/admin/habilidad/directivo.remote";
	

    const query = getHabilidadDirectivos()

	//console.log("Directivo:",data,query)
</script>
<h1>Directivo</h1>


{#if query.error}
	<p>oops!</p>
{:else if query.loading}
		<Spinner class="size-8" />
			
{:else}
	

<Table.Root>
  <Table.Caption>Lista de estados de habilidad asociado </Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-[100px]">Identificación</Table.Head>
      <Table.Head>Asociado</Table.Head>
      <Table.Head>estado</Table.Head>
      <Table.Head class="text-end">Dias en Aportes</Table.Head>
	   <Table.Head class="text-end">Dias en Creditos</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
   	{#each query.current as { identificacion,nombres,habilidad,mora_aporte,moras_credito,nhabilidad }}
			<!-- <li>{identificacion} {descripcion} {asociado.nombres} {asociado.habilidad}</li> -->
	
      <Table.Row class={nhabilidad!==1?"text-red-500":""}>
        <Table.Cell class="font-medium">{identificacion}</Table.Cell>
        <Table.Cell>{nombres}</Table.Cell>
        <Table.Cell>{habilidad}</Table.Cell>
        <Table.Cell class="text-end">{mora_aporte}</Table.Cell>
		  <Table.Cell class="text-end">{moras_credito}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
  <Table.Footer>
    <Table.Row>
     <!--  <Table.Cell colspan={3}>Total</Table.Cell>
      <Table.Cell class="text-end">$2,500.00</Table.Cell> -->
    </Table.Row>
  </Table.Footer>
</Table.Root>
	
{/if}
