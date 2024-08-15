<script>
    import { useChat } from '@ai-sdk/svelte';
    import { Send, User, Bot } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardHeader } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
  
    const { input, handleSubmit, messages } = useChat({
        maxToolRoundtrips: 5,
    });
  </script>
  
  <main class="flex flex-col sm:w-2/3 mx-auto h-screen gap-2">
    <ul class="flex flex-col flex-grow overflow-y-auto gap-2">
      {#each $messages as message}
        <li>
            <Card>
                <CardHeader>
                    {#if message.role === 'user'}
                        <User />
                    {:else}
                        <Bot />
                    {/if}
                </CardHeader>
                <CardContent>
                    {message.content}
                </CardContent>
            </Card>
        </li>
      {/each}
    </ul>
    <form on:submit={handleSubmit}>
        <Card class="flex flex-row gap-2 p-4 rounded-bl-none rounded-br-none">
            <Input bind:value={$input} />
            <Button type="submit">
                <Send />
            </Button>
        </Card>
    </form>
  </main>