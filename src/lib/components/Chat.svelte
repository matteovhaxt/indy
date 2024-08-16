<script lang="ts">
    import { useChat } from '@ai-sdk/svelte';
    import { Send, User, Bot } from "lucide-svelte";

    import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardHeader } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	  
    const { input, handleSubmit, messages } = useChat({
        maxToolRoundtrips: 5,
    });
</script>

<div class="flex flex-col h-full px-2 pt-2 mx-auto">
    <ul class="flex-1 flex flex-col overflow-y-auto mb-2 gap-2">
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
</div>