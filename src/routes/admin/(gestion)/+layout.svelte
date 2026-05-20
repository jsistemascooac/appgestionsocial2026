 <script lang="ts">

	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	
	import SiteHeader from "$lib/components/site-header.svelte";
	
	import AppSidebar from "$lib/components/admin/dashboard/app-sidebar.svelte";
	import type { LayoutProps } from "../../$types";
    
	let { data, children }: LayoutProps = $props();

</script>

<Sidebar.Provider
	style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
	<AppSidebar variant="inset" perfil={data.perfil} user={data.user}/>
	<Sidebar.Inset>
		<SiteHeader />
		<div class="flex flex-1 flex-col">
			<div class="@container/main flex flex-1 flex-col gap-2">
			    {@render children()}
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
 