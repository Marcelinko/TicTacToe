<script lang="ts">
	import { page } from '$app/stores';
	import {goto} from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="flex flex-auto flex-col justify-center items-center">
	<h1 class="text-primary text-4xl font-bold">{$page.status}</h1>
	<p class="text-secondary text-lg">{$page.error?.message}</p>
	<Button class="my-4" on:click={()=> goto('/', {replaceState: true})}>
		Return home
	</Button>
</div>