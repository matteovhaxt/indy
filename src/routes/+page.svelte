<script lang="ts">
	import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import Chat from '$lib/components/Chat.svelte';
	import Artifact from '$lib/components/Artifact.svelte';

    const artifactUrl = writable("");

    const fetchUrl = async () => {
        const response = await fetch("/api/sandbox/url");
        const { url } = await response.json();
        artifactUrl.set(url);
    }

    onMount(async () => {
        await fetchUrl();
    });

    const refreshPreview = async (url: string | undefined) => {
        if (url) {
            artifactUrl.set(url);
        } else {
            artifactUrl.set($artifactUrl);
        }
    }
</script>
  
<main class="flex flex-row mx-auto h-screen p-2 gap-2">
    <div class="flex-1">
        <Chat refreshPreview={refreshPreview} />
    </div>
    <div class="flex-1">
        <Artifact url={$artifactUrl} />
    </div>
  </main>