<script lang="ts">
 import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
 import { Button } from "$lib/components/ui/button/index.js";
 import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { goto } from "$app/navigation";
	import type { StringFormatParams } from "zod/v4/core";
 
 let { id,funcionalidad,enable }: { id: string,funcionalidad:string,enable:boolean } = $props();
</script>
 
<DropdownMenu.Root>
 <DropdownMenu.Trigger>
  {#snippet child({ props })}
   <Button
    {...props}
    variant="ghost"
    size="icon"
    class="relative size-8 p-0"
   >
    <span class="sr-only">Open menu</span>
    <EllipsisIcon />
   </Button>
  {/snippet}
 </DropdownMenu.Trigger>
 <DropdownMenu.Content >
  <DropdownMenu.Group>
   <DropdownMenu.Label>Acciones</DropdownMenu.Label>
   <DropdownMenu.Item disabled={enable} onclick={() => goto('/asociado/solicitud/editar/'+id+'/'+funcionalidad)}>
    Editar 
   </DropdownMenu.Item>
  </DropdownMenu.Group>
  <DropdownMenu.Separator />
  <DropdownMenu.Item disabled>Seguimiento</DropdownMenu.Item>
<!--   <DropdownMenu.Item>View payment details</DropdownMenu.Item> -->
 </DropdownMenu.Content>
</DropdownMenu.Root>