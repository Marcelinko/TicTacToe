<script lang="ts">
	import type { Room } from '$lib/types';

	import { goto } from '$app/navigation';
	import { Socket } from 'socket.io-client';
	import { page } from '$app/stores';
	import { nicknameSchema } from '$lib/validation';

	import { onMount, getContext } from 'svelte';

	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft } from 'lucide-svelte';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import room from '$lib/room';

	const socket: Socket = getContext('socket');
	let roomId = $page.data.roomId;
	let nicknameInput: HTMLInputElement;
	let nickname = '';
	let error = '';
	let socketError = '';
	let loading = false;
	let alertOpen = false;


	const createRoom = () => {
		loading = true;
		const res = nicknameSchema.safeParse(nickname);
		if (!res.success) {
			error = res.error.errors[0].message;
			loading = false;

		}
		socket.emit('room:create', { nickname }, (newRoom: Room) => {
			room.set(newRoom);
			goto(`/play`, { replaceState: true });
		});
	};
	const joinRoom = () => {
		loading = true;
		const res = nicknameSchema.safeParse(nickname);
		if (!res.success) {
			error = res.error.errors[0].message;
			loading = false;
		}
		socket.emit('room:join', { roomId, nickname }, (newRoom: Room, error: string) => {
			if (error) {
				loading = false;
				socketError = error;
				alertOpen = true;
				return;
			}
			room.set(newRoom);
			goto(`/play`, { replaceState: true });
		});
	};
	const handleEnter = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			roomId ? joinRoom() : createRoom();
		}
	};

	onMount(() => {
		nicknameInput.focus();
	});

</script>
<svelte:head>
	<title>Tic Tac Toe: Play Online with Friends</title>
	<meta content="Experience the ultimate Tic Tac Toe showdown online! Play against friends or challenge advanced AI bots for an intense gaming thrill!"
				name="description">
	<meta content="Tic Tac Toe: Play Online with Friends" property="og:title">
	<meta content="Experience the ultimate Tic Tac Toe showdown online! Play against friends or challenge advanced AI bots for an intense gaming thrill!"
				property="og:description">
	<meta content="https://tictactoe-mcts.up.railway.app/" property="og:url">
	<meta content="Tic Tac Toe: Play Online with Friends" property="twitter:title">
	<meta content="Experience the ultimate Tic Tac Toe showdown online! Play against friends or challenge advanced AI bots for an intense gaming thrill!"
				property="twitter:description">
	<meta content="#F2CB07" name="theme-color">
	<meta content="PMN-1aHSnHiQ8gNH2Rh88no2fFIUHac58kq85TRN9Hk" name="google-site-verification" />
</svelte:head>
<svelte:window on:keydown={handleEnter} />
<AlertDialog.Root open={alertOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Can not join room</AlertDialog.Title>
			<AlertDialog.Description>
				{socketError}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Action on:click={() => alertOpen = false}>Ok</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
<Header />
<main class="flex flex-auto w-full items-center justify-center">
	<div
		class="relative mx-4 flex h-full min-h-[300px] max-h-[470px] w-full max-w-[610px] flex-col items-center justify-between border-none bg-[#1B1E22] px-8 py-11 sm:rounded-[12px]"
	>
		{#if roomId}
			<Button class="absolute top-0 left-0 ml-6 mt-11 hover:bg-transparent" size="icon" variant="ghost"
							on:click={() => roomId = ''}>
				<ChevronLeft class="h-8 w-8 text-secondary" />
			</Button>
		{/if}
		<div class="flex flex-col gap-2">
			<h1 class="text-3xl font-bold text-white text-center">{roomId ? 'Join room' : 'Create room'}</h1>
			{#if roomId}
				<p class="text-secondary text-center">Room ID: <span class="text-accent">{roomId}</span></p>
			{/if}
		</div>
		<div>
			<label
				class="font-lg block text-sm font-bold uppercase leading-6 text-secondary"
				for="nickname">Nickname</label
			>
			<div class="mt-2">
				<input
					bind:this={nicknameInput}
					bind:value={nickname}
					class="w-full rounded-md bg-background border-none text-md text-secondary focus:ring-primary focus:ring-2 py-3.5"
					id="nickname"
					name="nickname"
					on:focus={() => error = ''}
					required
					type="text"
				/>
				<p class="mt-1 text-[#FB3640]">{error}</p>
			</div>
		</div>
		{#if !loading}
			{#if roomId}
				<Button class="font-semibold text-base w-[150px] h-[45px]" on:click={joinRoom}>Join</Button>
			{:else}
				<Button class="font-semibold text-base w-[150px] h-[45px]" on:click={createRoom}>Create</Button>
			{/if}
		{:else}
			<Button class="font-semibold text-base w-[150px] h-[45px]">
				<svg class="animate-spin h-5 w-5 text-background-darker" xmlns="http://www.w3.org/2000/svg" fill="none"
						 viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-100" fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			</Button>
		{/if}
	</div>
</main>
<Footer />

