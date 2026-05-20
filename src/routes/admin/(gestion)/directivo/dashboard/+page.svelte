<script lang="ts">

	  import * as Tabs from "$lib/components/ui/tabs/index.js";
	import DirectivoGrupal from "$lib/components/admin/habilidad/directivo-grupal.svelte"; 

  export let data;
</script>


<Tabs.Root value="habilidades" >
  <Tabs.List>
    <Tabs.Trigger value="habilidades">Habilidades</Tabs.Trigger>
    <!-- <Tabs.Trigger value="grupal">Grupal</Tabs.Trigger> -->
	<Tabs.Trigger value="directivos">Directivos</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="habilidades">
 <DirectivoGrupal/>
  </Tabs.Content>
<!--   <Tabs.Content value="grupal">

  </Tabs.Content> -->
   <Tabs.Content value="directivos">

  </Tabs.Content>
</Tabs.Root>
