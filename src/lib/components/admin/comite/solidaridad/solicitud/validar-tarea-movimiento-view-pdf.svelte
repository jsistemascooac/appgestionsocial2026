<script lang="ts">


 import { Button } from "$lib/components/ui/button/index.js";
 import * as Sheet from "$lib/components/ui/sheet/index.js";
 import { buttonVariants } from "$lib/components/ui/button/index.js";
 import { Input } from "$lib/components/ui/input/index.js";
 import { Label } from "$lib/components/ui/label/index.js";

   let { archivo} = $props();

	function getArchivos(archivo: string) {
			let arhvioObj = Object.entries(JSON.parse(archivo));
		let arhivo = arhvioObj.find(([key, value]) => key === 'archivo')?.[1] ?? '';

		//	console.log('getArchivos:', arhivo);
		return arhivo;
	}

	function getArchivosId(archivo: string) {
		let arhvioObj = Object.entries(JSON.parse(archivo));
		let wfma_id = arhvioObj.find(([key, value]) => key === 'wfma_id')?.[1] ?? '';

		//	console.log('getArchivosId:', wfma_id);
		return wfma_id;
	}


</script>
 
<Sheet.Root>
 <Sheet.Trigger class={buttonVariants({ variant: "outline" })}
  >
  <div class="h-16 w-16 overflow-hidden">
											 <embed
												src="https://gestionsocial.cooaceded.coop/pb/api/files/pbc_2951797270/{getArchivosId(
													archivo
												)}/{getArchivos(archivo)}"
												type="application/pdf"
												class="pointer-events-none h-full w-full origin-top scale-150"
											/> 
											
										</div>
  
  </Sheet.Trigger
 >
 <Sheet.Content side="right">
  <Sheet.Header>
   <Sheet.Title>Edit profile</Sheet.Title>
   <Sheet.Description>
    Make changes to your profile here. Click save when you're done.
   </Sheet.Description>
  </Sheet.Header>
  <div class="grid flex-1 auto-rows-min gap-6 px-4">
   <div class="grid gap-3">
    <Label for="name" class="text-end">Name</Label>
    <Input id="name" value="Pedro Duarte" />
   </div>
   <div class="grid gap-3">
    <Label for="username" class="text-end">Username</Label>
    <Input id="username" value="@peduarte" />
   </div>
  </div>
  <Sheet.Footer>
   <Button type="submit">Save changes</Button>
   <Sheet.Close class={buttonVariants({ variant: "outline" })}
    >Close</Sheet.Close
   >
  </Sheet.Footer>
 </Sheet.Content>
</Sheet.Root>