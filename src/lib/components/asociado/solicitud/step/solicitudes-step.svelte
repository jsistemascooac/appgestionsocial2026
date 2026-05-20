<script lang="ts">
  
	import { Check } from "@lucide/svelte";

  // Paso actual de la solicitud (1-basado)
    
  let statusId = $props()

  let currentStep = 2;
  const steps = [
    { id: 1, title: "Enviada", desc: "10 Feb, 2024" },
    { id: 2, title: "En Revisión", desc: "En proceso" },
    { id: 3, title: "Aprobada", desc: "Pendiente" },
    { id: 4, title: "Finalizada", desc: "Pendiente" }
  ];

  
  console.log("Solicitudes, pasos:",statusId)
</script>

<div class="flex w-full items-center justify-between space-x-4 p-4">
  {#each steps as step, i}
    <div class="flex flex-1 items-center">
      <!-- Círculo del Indicador -->
      <div class="flex flex-col items-center">
        <div 
          class="flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors
          {step.id < currentStep ? 'bg-primary border-primary text-primary-foreground' : 
           step.id === currentStep ? 'border-primary text-primary ring-4 ring-primary/20' : 
           'border-muted text-muted-foreground'}"
        >
          {#if step.id < currentStep}
            <Check class="h-5 w-5" />
          {:else}
            <span class="text-sm font-bold">{step.id}</span>
          {/if}
        </div>
        
        <!-- Textos -->
        <div class="absolute mt-14 text-center">
          <p class="text-sm font-medium leading-none">{step.title}</p>
          <p class="text-xs text-muted-foreground mt-1">{step.desc}</p>
        </div>
      </div>

      <!-- Línea conectora (Separator) -->
      {#if i < steps.length - 1}
        <div class="mx-2 flex-1 h-[2px] bg-muted relative -top-3">
            <div 
                class="h-full bg-primary transition-all duration-500" 
                style="width: {step.id < currentStep ? '100%' : '0%'}"
            ></div>
        </div>
      {/if}
    </div>
  {/each}
</div>
