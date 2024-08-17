<script lang="ts">
    import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
    import { ChevronRight, Folder, File } from 'lucide-svelte';
  
    export let tree: { [key: string]: {} | null };
    export let indent: number = 1;
  </script>
  
  <ul class="list-none">
    {#each Object.entries(tree) as [name, item]}
      <li>
        <Collapsible class="my-2">
          <CollapsibleTrigger class="group flex items-center w-full gap-2">
            {#if item !== null && Object.keys(item).length > 0}
              <ChevronRight class="w-4 h-4 transition-transform duration-100 ease-in-out group-data-[state=open]:rotate-90" />
              <Folder class="w-4 h-4" />
            {:else}
              <File class="w-4 h-4" style="margin-left: {indent * 1.5}rem;"/>
            {/if}
            <span>{name}</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <svelte:self tree={item} indent={indent + 1} />
          </CollapsibleContent>
        </Collapsible>
      </li>
    {/each}
  </ul>