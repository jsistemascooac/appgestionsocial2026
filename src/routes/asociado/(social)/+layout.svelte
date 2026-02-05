<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	
	import SiteHeader from '$lib/components/site-header.svelte';
	import type { LayoutProps } from '../$types';
	import AppSidebar from '$lib/components/asociado/dashboard/app-sidebar.svelte';
//	import { getUsuario } from '$lib/api/asociado/login/user.remote';

//	let cookiesasociado = await getUsuario();

	//const asociado = JSON.parse(cookiesasociado ? cookiesasociado : 'null');

	let { data,children }: LayoutProps = $props();


	
	//console.log("Layout asociado:",data)
</script>

<Sidebar.Provider
	style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
	<AppSidebar variant="inset" usuario={data.asociado}/>
	<Sidebar.Inset>
		<SiteHeader />
		<div class="flex flex-1 flex-col">
			<div class="@container/main flex flex-1 flex-col gap-2">
				{@render children()}
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
