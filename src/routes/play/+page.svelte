<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import type { Socket } from 'socket.io-client';
	import { onDestroy, onMount, getContext } from 'svelte';


	import Board from './Board.svelte';
	import User from './User.svelte';
	import Header from './Header.svelte';

	const socket: Socket = getContext('socket');
	import room from '$lib/room';
	import { toast } from 'svelte-sonner';
	import moveSound from '$lib/assets/sounds/tap.mp3';

	let audio: HTMLAudioElement;

	if (browser && !$room.users) {
		goto('/', { replaceState: true });
	}

	onMount(() => {
		socket.on('room:update', (newRoom) => {
			room.set(newRoom);
		});
		socket.on('room:kicked', () => {
			toast('You have been kicked from the room');
			goto('/', { replaceState: true });
		});
		socket.on('tic-tac-toe:winner', (winner) => {
			toast(`Winner: ${winner}`);
		});
		socket.on('tic-tac-toe:move', () => {
			if(audio) audio.play();
		});
	});

	onDestroy(() => {
		socket.off('room:update');
		socket.off('room:kicked');
		socket.off('tic-tac-toe:winner');
		socket.off('tic-tac-toe:move');
	});
</script>

<audio bind:this={audio} src={moveSound}></audio>
<Header />
<main class="flex flex-wrap justify-center items-center lg:flex-auto h-full gap-y-20">
	<User symbol="cross" user={$room.users[0]} />
	<div class="justify-center flex order-first basis-full lg:basis-auto lg:w-[500px] lg:mx-6">
		<Board />
	</div>
	<User symbol="circle" user={$room.users[1]} />
</main>