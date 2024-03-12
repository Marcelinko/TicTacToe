import { writable } from 'svelte/store';
import type { Room } from '$lib/types';

export default writable<Room>();