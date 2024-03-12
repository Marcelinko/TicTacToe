export async function load({ url }) {
	const roomId = url.searchParams.get('id');
	return { roomId };
}
