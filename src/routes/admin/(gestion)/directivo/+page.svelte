<script lang="ts">
  import DirectivoIndividual from "$lib/components/admin/habilidad/directivo-individual.svelte";
  import DirectivoGrupal from "$lib/components/admin/habilidad/directivo-directivos.svelte";
 import { Label } from "$lib/components/ui/label/index.js";
 import { Switch } from "$lib/components/ui/switch/index.js";

    let { data } = $props();
    let esGrupal = $state(false);
</script>

<div class="flex items-center space-x-2">
  <!-- Sincronizamos la variable con el componente usando bind:checked -->
  <Switch id="airplane-mode" bind:checked={esGrupal} />
  
  <Label for="airplane-mode">Consulta Grupal</Label>
</div>

{#if esGrupal}
<DirectivoGrupal/>
{:else}
 <DirectivoIndividual/>
{/if}