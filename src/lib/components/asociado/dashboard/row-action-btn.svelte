<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { selectedId, isSheetOpen } from "./store"; // Importas tu store

  let {id, rowData} = $props()

  function openDetails() {
    $selectedId = rowData; // Guardamos todo el objeto o solo el ID
    $isSheetOpen = true;   // Abrimos el Sheet
  }
</script>

<Button variant="ghost" size="sm" onclick={openDetails}>
  Ver Progreso
</Button>
