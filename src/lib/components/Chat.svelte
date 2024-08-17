<script lang="ts">
    import { useChat } from '@ai-sdk/svelte';
    import { Send, User, Bot, LoaderIcon, CheckIcon } from "lucide-svelte";
    import { marked } from 'marked';

    import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardHeader, CardFooter } from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
	import { Badge } from "$lib/components/ui/badge";
	  
    const { input, handleSubmit, messages } = useChat({
        maxToolRoundtrips: 5,
    });
</script>

<div class="flex flex-col h-full">
    <ul class="flex-1 flex flex-col overflow-y-auto">
        {#each $messages as message}
          <li class="mb-2">
              <Card>
                  <CardHeader>
                      {#if message.role === 'user'}
                          <User />
                      {:else}
                          <Bot />
                      {/if}
                  </CardHeader>
                  <CardContent>
                        {@html marked(message.content)} 
                  </CardContent>
                {#each (message.toolInvocations ?? []) as tool}
                    <CardFooter class="flex flex-row justify-between">
                        <Badge>{tool.toolName}</Badge>
                        {#if tool.state === "call" || tool.state === "partial-call"}
                            <LoaderIcon class="w-4 h-4 animate-spin" />
                        {:else if tool.state === "result"}
                            <CheckIcon class="w-4 h-4" />
                        {/if}
                    </CardFooter>
                {/each}
              </Card>
          </li>
        {/each}
      </ul>
      <form on:submit={handleSubmit}>
          <Card class="flex flex-row gap-2 p-4">
              <Input bind:value={$input} />
              <Button type="submit">
                  <Send />
              </Button>
          </Card>
      </form>
</div>