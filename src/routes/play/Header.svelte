<script lang="ts">
	import { Copy, LogOut, Menu, ArrowLeftRight, RotateCcw, UserRound } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import type { Socket } from 'socket.io-client';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { getContext } from 'svelte';
	import {env} from '$env/dynamic/public'

	const socket: Socket = getContext('socket');
	import room from '$lib/room';
	import type { User,Bot } from '$lib/types';

	const leaveRoom = () => {
		socket.emit('room:leave', { roomId: $room.id });
		goto('/', { replaceState: true });
	};
	const kick = (user: User | Bot) => {
		socket.emit('room:removeUser', { userId: user.id, roomId: $room.id }, (error: string) => {
			if (error) {
				toast(error)
			}
		});
	};
	//TODO: ENV file for the url
	const invitePlayers = () => {
		navigator.clipboard.writeText(`${env.PUBLIC_URL}/?id=` + $room.id);
		toast('Link copied to clipboard');
	};
	const swapSymbols = () => {
		socket.emit('room:swapPlaces', { roomId: $room.id }, (error: string) => {
			if (error) {
				toast(error);
			}
		});
	};
	const newGame = () => {
		socket.emit('tic-tac-toe:newGame', { roomId: $room.id }, (error: string) => {
			if (error) {
				toast(error);
			}
		});
	};
</script>

<header class="flex w-full max-w-[1400px] self-center m-4 px-4 justify-between">
	<Sheet.Root>
		<Sheet.Trigger asChild let:builder>
			<Button builders={[builder]} class="hover:bg-transparent  md:hidden" size="icon" variant="ghost">
				<Menu class="h-8 w-8 text-secondary" />
			</Button>
		</Sheet.Trigger>
		<Sheet.Content side="left">
			<Sheet.Title class="text-center">Room settings</Sheet.Title>
			<div class="flex flex-col gap-4 mt-4">
				<Button on:click={leaveRoom} variant="secondary">
					<LogOut class="mr-2 h-5 w-5" />
					Leave
				</Button>
				<Sheet.Close asChild let:builder>
				<Button builders={[builder]} on:click={invitePlayers} variant="secondary">
					<Copy class="mr-2 h-5 w-5" />
					Invite friend
				</Button>
				</Sheet.Close>
				{#if $room.users.length > 1 && socket.id === $room.owner}
					<Sheet.Close asChild let:builder>
					<Button builders={[builder]} on:click={swapSymbols} variant="secondary">
						<ArrowLeftRight class="mr-2 h-5 w-5" />
						Swap symbols
					</Button>
					</Sheet.Close>
					<Sheet.Close asChild let:builder>
						<Button builders={[builder]} on:click={newGame} variant="secondary">
							<RotateCcw class="mr-2 h-5 w-5" />
							New game
						</Button>
					</Sheet.Close>
				{/if}
				{#each $room.users as user (user.id)}
					<div class="flex justify-between">
						<div class="flex items-center gap-2">
							<UserRound class="h-5 w-5" />
							<span>{user.nickname}</span>
						</div>
						{#if user?.id !== socket.id && socket.id === $room.owner}
							<Button on:click={() => kick(user)} variant="secondary">Kick</Button>
						{/if}
					</div>
				{/each}
			</div>
		</Sheet.Content>
	</Sheet.Root>

	<div class="flex gap-4 invisible md:visible">
		<Button on:click={leaveRoom} variant="secondary">
			<LogOut class="mr-2 h-5 w-5" />
			Leave
		</Button>
		<Button on:click={invitePlayers} variant="secondary">
			<Copy class="mr-2 h-5 w-5" />
			Invite friend
		</Button>
		{#if $room.users.length > 1 && socket.id === $room.owner}
			<Button on:click={swapSymbols} variant="secondary">
				<ArrowLeftRight class="mr-2 h-5 w-5" />
				Swap symbols
			</Button>
			<Button on:click={newGame} variant="secondary">
				<RotateCcw class="mr-2 h-5 w-5" />
				New game
			</Button>
		{/if}
	</div>
</header>