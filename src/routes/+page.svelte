<script>
    import Chat from '$lib/components/Chat.svelte';
	import Artifact from '$lib/components/Artifact.svelte';
  </script>
  
<main class="flex flex-row mx-auto h-screen gap-2">
    <div class="flex-1">
        <Chat />
    </div>
    <div class="flex-1">
        <Artifact url="" />
    </div>
  </main>