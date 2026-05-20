<script lang="ts">
 import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
 import { Button } from "$lib/components/ui/button/index.js";
 import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { goto } from "$app/navigation";
	import type { StringFormatParams } from "zod/v4/core";

	import { toast } from "svelte-sonner";
	import { addWFValidarTarea } from "$lib/api/admin/comite/sepe/solicitud/validar.remote";
 
 let { id,tipo}: { id: string,tipo: string } = $props();

//console.log("data-tbale-actions:", tipo)
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
   <DropdownMenu.Item  onclick={async () => {
    
		try {
      if(tipo==="add"){
			let validar = await addWFValidarTarea(id);
      
      toast.success('Estado actualizado correctamente'+validar);
      goto('/admin/comite/sepe/solicitud/editar/' + validar.id);
      }else{
        goto('/admin/comite/sepe/solicitud/editar/' + id);
      }
		} catch (error) {
			toast('Hay un error!'+error);
		}
	}}>
    Editar 
   </DropdownMenu.Item> 
  </DropdownMenu.Group>
  <DropdownMenu.Separator />
  <DropdownMenu.Item disabled>Seguimiento</DropdownMenu.Item>
<!--   <DropdownMenu.Item>View payment details</DropdownMenu.Item> -->
 </DropdownMenu.Content>
</DropdownMenu.Root>