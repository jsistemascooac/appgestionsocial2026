<script lang="ts">
 	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';

	
	import { toast } from 'svelte-sonner';
	import { createSolicitud, getPostWithImage, getWorkFlows } from '$lib/api/asociado/solicitud/solicitud.remote';
	import { getUsuario } from '$lib/api/asociado/login/user.remote';
	import { getRequestEvent } from '$app/server';

	let { data }: PageProps = $props(); 
 	 let cookiesasociado = await getUsuario(); 
// let asociado = data.asociado
//	let asociado = JSON.parse(cookiesasociado ? cookiesasociado : 'null');



	const query = getWorkFlows();

     // 	console.log("Solicitud Nueva0:",query)

	let idWorkflow = $state('')
	let urlfuncionalidad= $state('')
	//let responseApi=$state(asociado)
	console.log("Solicitud Nueva:",cookiesasociado) 
</script>
 
 {#if query.error}
	<p>oops!</p>
{:else if query.loading}
	<p>loading...</p>
{:else} 

<!--  {#await getWorkFlows()}
    loading..
{:then wf}
 -->    <form
		{...createSolicitud.enhance(async ({ submit }) => {
			try {
              //  alert("Si entra")
				await submit();
				// console.log('Resultado del submit:', form.message);
				toast.success('La solicitud se ha creado correctamente!');
			} catch (error) {
				console.error('Error al enviar el formulario:', error);
				toast.error(`Oh no! Algo salio mal,${error},Error interno del servidor`);
			}
		})} 
	>
	
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
    <input hidden name="workflow" bind:value={idWorkflow} />
    <input hidden name="urlfuncionalidad" bind:value={urlfuncionalidad} />
    <input hidden name="response_api" bind:value={cookiesasociado} /> 
    
    {#each query.current as {  id, card, funcionalidad,imagen }}
     <!-- {#each query.current as item,i} -->
 
        <button
            type="submit"
            class="card h-full w-full text-left" 
            onclick={() => {
                idWorkflow = id;
                urlfuncionalidad = funcionalidad;
            }}
        >
           
            <Card.Root class="flex flex-col h-full w-full">
                <Card.Header>
                   <!--  <Card.Title>{card.encabezado}</Card.Title> -->
                    <Card.Description>
                      <!--   {card.descripcion} -->
                        
                    </Card.Description>
                </Card.Header>
                
              
                <Card.Content class="grid gap-6 flex-grow">
                    <div class="grid gap-3">
                     <!--    {#each card.cuerpo.caracteristicas as c}
                            <label for="">{c}</label>
                        {/each} -->
                       <!--  <img src="/test_wf.jpg" alt="Imagen del flujo de trabajo" class="w-full h-auto rounded-md" /> -->
                          <img src={'https://gestionsocial.cooaceded.coop/pb/api/files/pbc_763866827/'+id+"/"+imagen} alt="Imagen del flujo de trabajo" class="w-full h-auto rounded-md" /> 
                    </div>
                </Card.Content>
                
                <Card.Footer>
              
                    {#if id === idWorkflow}
                        <span class="check-badge">✓</span>
                    {/if}
                </Card.Footer>
            </Card.Root>
        </button>
    {/each}
		</div>
	</form> 
    
<!--{:catch error}
    <p>Error al cargar los flujos de trabajo: {error.message}</p>
 {/await}   -->
	
 {/if}  
{#each createSolicitud.fields.allIssues() as issue}
	<p class="issue">{issue.message}</p>
{/each}
 