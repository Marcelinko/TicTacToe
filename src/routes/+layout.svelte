<script lang="ts">
	import "../app.css";
	import { io, Socket } from 'socket.io-client';
	import { Toaster } from "$lib/components/ui/sonner";
	import { toast } from 'svelte-sonner';
	import {setContext} from 'svelte';
	import { browser } from '$app/environment';

	if(browser){
		const socket: Socket = io()

		socket.on('connect', () => {
			toast('Connected to server');
		});

		socket.on('disconnect', () => {
			toast('Disconnected from server');
		});

		setContext('socket', socket);
	}
</script>

<Toaster />
<slot />
