<script>
  import {
    DetailSummary,
    ActionButton,
    Drawer,
    Button,
    notifications,
    AbsTooltip,
    Icon,
    Body,
  } from "@budibase/bbui"
  import { selectedScreen, componentStore } from "stores/builder"
  import ClientBindingPanel from "components/common/bindings/ClientBindingPanel.svelte"
  import {
    getBindableProperties,
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "dataBinding"

  export let componentInstance
  export let componentDefinition
  export let iconTooltip
  export let componentTitle

  let tempValue
  let drawer

  $: bindings = getBindableProperties(
    $selectedScreen,
    $componentStore.selectedComponentId
  )

  $: icon = componentDefinition?.icon

  const openDrawer = () => {
    tempValue = runtimeToReadableBinding(
      bindings,
      componentInstance?._styles?.custom
    )
    drawer.show()
  }

  const save = async () => {
    try {
      const value = readableToRuntimeBinding(bindings, tempValue)
      await componentStore.updateCustomStyle(value)
    } catch (error) {
      notifications.error("更新自定义样式时出错")
    }
    drawer.hide()
  }
</script>

<DetailSummary
  name={`自定义CSS${componentInstance?._styles?.custom ? " *" : ""}`}
  collapsible={false}
>
  <div>
    <ActionButton on:click={openDrawer}>编辑自定义CSS</ActionButton>
  </div>
</DetailSummary>
{#key componentInstance?._id}
  <Drawer bind:this={drawer} title="自定义CSS">
    <svelte:fragment slot="description">
      <div class="header">
        您的CSS将覆盖以下项的样式：
        {#if icon}
          <AbsTooltip type="info" text={iconTooltip}>
            <Icon
              color={`var(--spectrum-global-color-gray-600)`}
              size="S"
              name={icon}
            />
          </AbsTooltip>
          <Body size="S"><b>{componentTitle || ""}</b></Body>
        {/if}
      </div>
    </svelte:fragment>
    <Button cta slot="buttons" on:click={save}>Save</Button>
    <svelte:component
      this={ClientBindingPanel}
      slot="body"
      value={tempValue}
      on:change={event => (tempValue = event.detail)}
      allowJS
      {bindings}
      autofocusEditor={true}
    />
  </Drawer>
{/key}

<style>
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
  }
</style>
