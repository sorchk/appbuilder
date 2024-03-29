<script>
  import { Body, Layout, Heading, Button, Tabs, Tab } from "@budibase/bbui"
  import { builderStore, devToolsStore, componentStore } from "stores"
  import DevToolsStat from "./DevToolsStat.svelte"
  import DevToolsComponentSettingsTab from "./DevToolsComponentSettingsTab.svelte"
  import DevToolsComponentContextTab from "./DevToolsComponentContextTab.svelte"

  $: {
    // Reset selection store if we can't find a matching instance
    if (!$componentStore.selectedComponentInstance) {
      builderStore.actions.selectComponent(null)
    }
  }
</script>

{#if !$builderStore.selectedComponentId}
  <Layout noPadding gap="S">
    <Heading size="XS">请选择一个组件</Heading>
    <Body size="S">
      按下下面的按钮以启用组件选择，然后单击组件，以查看其设置和可用的数据绑定。
    </Body>
    <div>
      <Button
        cta
        on:click={() => devToolsStore.actions.setAllowSelection(true)}
      >
      选择组件
      </Button>
    </div>
  </Layout>
{:else}
  <Layout noPadding gap="S">
    <Heading size="XS">
      {$componentStore.selectedComponent?._instanceName}
    </Heading>
    <Layout noPadding gap="XS">
      <DevToolsStat
        label="Type"
        value={$componentStore.selectedComponentDefinition?.name}
      />
      <DevToolsStat
        copyable
        label="Component ID"
        value={$componentStore.selectedComponent?._id}
      />
    </Layout>
    <div class="buttons">
      <Button
        cta
        on:click={() => devToolsStore.actions.setAllowSelection(true)}
      >
        Change component
      </Button>
      <Button
        quiet
        secondary
        on:click={() => builderStore.actions.selectComponent(null)}
      >
        Reset
      </Button>
    </div>

    <div class="data">
      <Layout noPadding gap="XS">
        <Tabs selected="设置">
          <Tab title="设置">
            <div class="tab-content">
              <DevToolsComponentSettingsTab />
            </div>
          </Tab>
          <Tab title="Bindings">
            <div class="tab-content">
              <DevToolsComponentContextTab />
            </div>
          </Tab>
        </Tabs>
      </Layout>
    </div>
  </Layout>
{/if}

<style>
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xs);
  }
  .data {
    margin: 0 calc(-1 * var(--spacing-xl));
  }
  .data :global(.spectrum-Textfield-input) {
    min-height: 200px !important;
    white-space: pre;
    font-size: var(--font-size-s);
  }
  .tab-content {
    padding: 0 var(--spacing-xl);
  }
</style>
