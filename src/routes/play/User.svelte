<script lang="ts">
	import type { Socket } from 'socket.io-client';
	import type { User, Bot } from '$lib/types';

	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import robot from '$lib/assets/images/robot.png';
	import player from '$lib/assets/images/player.png';
	import { Circle, X, Plus } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { getContext } from 'svelte';

	const socket: Socket = getContext('socket');
	import room from '$lib/room';
	import { toast } from 'svelte-sonner';


	export let user: User | Bot;
	export let symbol: string;

	const addBot = (difficulty: string) => {
		socket.emit('room:addBot', { roomId: $room.id, difficulty }, (error: string) => {
			if (error) {
				toast(error)
			}
		});
	};
	const kick = (user: User | Bot) => {
		socket.emit('room:removeUser', { userId: user.id, roomId: $room.id }, (error: string) => {
			if (error) {
				toast(error)
			}
		});
	};

</script>

<div class="lg:order-first mx-2 w-[calc(50%-25px)] relative bg-[#1B1E22] max-w-[220px] max-h-[160px] h-full rounded-md">
	<Avatar.Root
		class="ring-4 w-16 h-16 md:w-24 md:h-24 ring-accent bg-secondary absolute left-1/2 top-1 -translate-x-1/2 -translate-y-1/2">
		{#if user}
			<Avatar.Image class="p-2" alt="avatar" src={user?.id !== 'bot' ? player : robot} />
			<Avatar.Fallback>{user?.nickname[0]}</Avatar.Fallback>
		{:else}
			<div class="w-full h-full flex justify-center items-center bg-background">
				<Plus class="h-6 w-6 md:w-10 md:h-10 text-secondary" strokeWidth={2} />
			</div>
		{/if}
	</Avatar.Root>
	<div class="absolute bottom-0 mb-4 left-1/2 -translate-x-1/2 flex gap-2 flex-col items-center">
		{#if user}
			{#if 'difficulty' in user}
				<p class="text-secondary text-md mt-4 text-center">{user?.nickname} ({user?.difficulty})</p>
			{:else}
				<p class="text-secondary text-md mt-4">{user?.nickname}</p>
			{/if}
		{:else}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class="text-md underline">Add bot</DropdownMenu.Trigger>
				<DropdownMenu.Content class="bg-[#1B1E22]">
					<DropdownMenu.Group>
						<DropdownMenu.Item on:click={() => addBot('easy')}>Easy😊</DropdownMenu.Item>
						<DropdownMenu.Item on:click={() => addBot('hard')}>Hard🧠</DropdownMenu.Item>
						<DropdownMenu.Item on:click={() => addBot('insane')}>Insane☠️</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}
		<div class="flex gap-2">
			<div class="p-2 bg-background w-10 h-10 flex justify-center items-center rounded-md">
				{#if symbol === 'circle'}
					<Circle class="text-accent" />
				{:else}
					<X class="text-accent" />
				{/if}
			</div>
			{#if user && user?.id !== socket.id && socket.id === $room.owner}
				<Button class="hidden md:block" on:click={() => kick(user)} variant="secondary">Kick</Button>
			{/if}
		</div>
	</div>
</div>