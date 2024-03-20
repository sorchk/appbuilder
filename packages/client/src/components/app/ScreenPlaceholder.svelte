<script>
  import { getContext } from "svelte"
  import { Heading, Body, Button } from "@budibase/bbui"

  const { builderStore } = getContext("sdk")
</script>

{#if $builderStore.inBuilder}
  <div class="placeholder">
    <Heading size="L">您的屏幕为空</Heading>
    <Body>添加一些组件，让您的应用程序栩栩如生！</Body>
    <Button cta icon="Add" on:click={builderStore.actions.requestAddComponent}
      >添加组件</Button
    >
  </div>
{/if}

<style>
  .placeholder {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-s);
    flex: 1 1 auto;
  }
  .placeholder :global(.spectrum-Button) {
    margin-top: var(--spacing-m);
  }
</style>
