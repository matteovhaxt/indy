<script lang="ts">
	import { onMount } from "svelte";
	import { writable } from "svelte/store";
	import { Loader } from "lucide-svelte";
	import Card from "./ui/card/card.svelte";
	import FileTree from "./FileTree.svelte";
    
    export let url: string | null = null;

    const fileTree = writable({});

    const fetchFiles = async () => {
        const response = await fetch("/api/sandbox/files");
        const { files } = await response.json();
        fileTree.set(files);
    }

    onMount(async () => {
        await fetchFiles();
    });
</script>

<div class="flex flex-col h-full gap-2">
    <Card class="flex-1 overflow-y-auto p-2">
        <FileTree tree={$fileTree} />
    </Card>
    <Card class="flex-1 overflow-clip">
        {#if url}
            <iframe title="artifact" src={url} class="w-full h-full" />
        {:else}
            <div class="w-full h-full flex items-center justify-center">
                <Loader class="animate-spin" />
            </div>
        {/if}
    </Card>
</div>