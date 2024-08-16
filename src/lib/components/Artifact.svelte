<script lang="ts">
	import Card from "./ui/card/card.svelte";

    export let url: string;
</script>

<div class="flex flex-col h-full">
    <Card class="flex-grow">
        <iframe title="artifact" src={url} />
    </Card>
</div>