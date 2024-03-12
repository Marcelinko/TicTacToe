<script lang="ts">
	import Circle from '$lib/assets/icons/Circle.svelte';
	import X from '$lib/assets/icons/X.svelte';
	import type { Socket } from 'socket.io-client';
	import { toast } from 'svelte-sonner';
	import { getContext } from 'svelte';
	import room from '$lib/room';
	const socket: Socket = getContext('socket');
	import {fade} from 'svelte/transition';

	export let value: string | null = null
	export let row: number;
	export let col: number;


	const applyMove = () => {
		socket.emit('tic-tac-toe:applyMove', {  roomId: $room.id, move:{row, col} }, (error: string) => {
			if (error) {
				toast(error);
			}
		});
	};

</script>

<div class="bg-background aspect-square rounded-[8px] flex justify-center items-center">
	<button class="w-full h-full p-4 rounded-[8px]" on:click={applyMove}>
		{#if value === 'X'}
			<div transition:fade>
				<X/>
			</div>
		{:else if value === 'O'}
			<div transition:fade>
				<Circle/>
			</div>
		{/if}
	</button>
</div>