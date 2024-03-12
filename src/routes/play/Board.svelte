<script lang="ts">
	import Cell from './Cell.svelte';
	import room from '$lib/room';
	import type { Game } from '$lib/types';
	import { getContext, onDestroy, onMount } from 'svelte';
	import type { Socket } from 'socket.io-client';


	const socket: Socket = getContext('socket');
	let board = $room.game.board;


	onMount(() => {
		socket.on('tic-tac-toe:update', (newGame: Game) => {
			board = newGame.board;
		});
	});
	onDestroy(() => {
		socket.off('tic-tac-toe:update');
	});
</script>

<div
	class="bg-[#1B1E22] aspect-square max-w-[500px] max-h-[500px] mx-4 w-full grid grid-cols-3 grid-rows-3 gap-4 p-4 rounded-lg">
	{#each board as row, i}
		{#each row as value, j}
			<Cell value={value} row={i} col={j} />
		{/each}
	{/each}
</div>