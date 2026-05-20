<script lang="ts">
	import CreditCardIcon from '@tabler/icons-svelte/icons/credit-card';
	import DotsVerticalIcon from '@tabler/icons-svelte/icons/dots-vertical';
	import LogoutIcon from '@tabler/icons-svelte/icons/logout';
	import NotificationIcon from '@tabler/icons-svelte/icons/notification';
	import UserCircleIcon from '@tabler/icons-svelte/icons/user-circle';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { logout } from '$lib/api/asociado/logout/logout.remote';
	import { toast } from 'svelte-sonner';

	let { user }: { user: { name: string; email: string; avatar: string;identificacion: string } } = $props();

	const sidebar = Sidebar.useSidebar();
	let form: HTMLFormElement;
//	console.log("Nav-user:",user)
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<Avatar.Root class="size-8 rounded-lg grayscale">
							<Avatar.Image src={user.avatar} alt={user.name} />

							<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-start text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="truncate text-xs text-muted-foreground">
								{user.email}
							</span>
						</div>
						<DotsVerticalIcon class="ms-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Image src={user.avatar} alt={user.name} />

							<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-start text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="truncate text-xs text-muted-foreground">
								{user.email}
							</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item disabled>
						<UserCircleIcon />
						Cuenta
					</DropdownMenu.Item>
					<!-- <DropdownMenu.Item>
						<CreditCardIcon />
						Billing
					</DropdownMenu.Item> -->
					<DropdownMenu.Item disabled>
						<NotificationIcon />
						Notificationes
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<form
					{...logout.enhance(async ({ submit }) => {
						try {
						//	alert('Pasa por aqui');
							await submit();
							//	form.reset();

							toast('Adios!');
						} catch (error) {
							toast('Oh no! Something went wrong');
						}
					})}
					bind:this={form}
				>
					<DropdownMenu.Item onclick={() => form.submit()}>
						<input hidden type="text" name="identificacion" value={user.identificacion} />
						<LogoutIcon />
						Salir
					</DropdownMenu.Item>
				</form>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
