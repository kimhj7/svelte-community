<!-- src/routes/new.svelte -->


<script lang="ts">
	import { onMount } from 'svelte';
	import user from '$lib/user';
	import { goto } from '$app/navigation';

	export let editId: string;
	export let title = '';
	export let description = '';
	export let content = '';

	onMount(() => {
		if (!$user) goto('/login');
	});

	// To edit the post
	async function editPost() {
		if (!localStorage.getItem('token')) {
			goto('/login');
			return;
		}

		const res = await fetch('http://localhost:8080/api/boards/' + editId, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('token')
			},
			body: JSON.stringify({ title, description, content })
		});
		if (!res.ok) {
			const data: { message: { messages: { message: string }[] }[] } = await res.json();
			if (data?.message?.[0]?.messages?.[0]?.message) {
				alert(data.message[0].messages[0].message);
			}
		} else {
			const data: Post = await res.json();
			goto('/blog/' + data.id);
		}
	}

	async function createPost() {
		if (!localStorage.getItem('token')) {
			goto('/login');
			return;
		}

		if (editId) {
			// We're supposed to edit, not create
			editPost();
			return;
		}

		const res = await fetch('http://localhost:8080/api/boards', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('token')
			},
			body: JSON.stringify({data:{ title, description, content }})
		});
		if (!res.ok) {
			const data: { message: { messages: { message: string }[] }[] } = await res.json();
			if (data?.message?.[0]?.messages?.[0]?.message) {
				alert(data.message[0].messages[0].message);
			}
		} else {
			const data: Post = await res.json();
			goto('/blog/' + data.id);
		}
	}
</script>

<form on:submit|preventDefault={createPost} class="my-4 mx-auto container p-4">
	<div class="my-1">
		<label for="title">Title</label>
		<input type="text" placeholder="Enter title" id="title" bind:value={title} />
	</div>
	<div class="my-1">
		<label for="description">Description</label>
		<input type="text" placeholder="Enter description" id="description" bind:value={description} />
	</div>
	<div class="my-1">
		<label for="title">Content</label>
		<textarea rows={5} placeholder="Enter content" id="content" bind:value={content} />
	</div>
	<div class="my-2">
		<button class="submit" type="submit">Submit</button>
	</div>
</form>

<style lang="postcss">
	label {
		@apply font-bold block mb-1;
	}

	input {
		@apply bg-white w-full border border-gray-500 rounded outline-none py-2 px-4;
	}

	textarea {
		@apply bg-white w-full border border-gray-500 rounded outline-none py-2 px-4 resize-y;
	}

	.submit {
		@apply bg-blue-500 text-white border-transparent rounded px-4 py-2;
	}
</style>
