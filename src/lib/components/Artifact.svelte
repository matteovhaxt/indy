<script lang="ts">
	import { onMount } from "svelte";
	import Card from "./ui/card/card.svelte";
	import { writable } from "svelte/store";
	import FileTree from "./FileTree.svelte";

    const fileTree = writable({});

    const fetchFiles = async () => {
        const response = await fetch("/api/sandbox/files");
        const { files } = await response.json();
        console.log(files);
        fileTree.set(files);
    }

    onMount(async () => {
        await fetchFiles();
    });
</script>

<div class="flex flex-col h-full">
    <Card class="flex-grow overflow-clip p-2">
        <FileTree tree={$fileTree} />
    </Card>
</div>