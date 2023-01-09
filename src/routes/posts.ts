
// src/routes/posts.ts

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EndpointOutput } from '@sveltejs/kit';

export async function get(): Promise<EndpointOutput> {
	const res = await fetch('http://localhost:8080/api/boards?populate=*');
	const data = await res.json();

	return { body: data };
}