<script>
  import { automationStore } from "stores/builder"
  import {
    notifications,
    Input,
    InlineAlert,
    ModalContent,
    Layout,
    Body,
    Icon,
    Label,
  } from "@budibase/bbui"
  import { TriggerStepID } from "constants/backend/automations"

  export let webhookModal

  let name
  let selectedTrigger
  let nameTouched = false
  let triggerVal

  $: nameError =
    nameTouched && !name ? "请指定自动化的名称。" : null
  $: triggers = Object.entries($automationStore.blockDefinitions.TRIGGER)

  async function createAutomation() {
    try {
      const trigger = automationStore.actions.constructBlock(
        "TRIGGER",
        triggerVal.stepId,
        triggerVal
      )
      await automationStore.actions.create(name, trigger)
      if (triggerVal.stepId === TriggerStepID.WEBHOOK) {
        webhookModal.show()
      }
      notifications.success(`已创建自动化 ${name}`)
    } catch (error) {
      notifications.error("创建自动化时出错")
    }
  }

  const selectTrigger = trigger => {
    triggerVal = trigger
    selectedTrigger = trigger.name
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<ModalContent
  title="创建自动化"
  confirmText="保存"
  size="M"
  onConfirm={createAutomation}
  disabled={!selectedTrigger || !name}
>
  <InlineAlert
    header="您必须发布应用程序才能激活自动操作。"
    message="要在发布前测试自动化，可以使用下一屏幕上的“运行测试”功能。"
  />
  <Body size="S">
    请命名您的自动化，然后选择一个触发器<br/>
    每一次自动化都必须从一个触发器开始。
  </Body>
  <Input
    bind:value={name}
    on:input={() => (nameTouched = true)}
    bind:error={nameError}
    label="名称"
  />

  <Layout noPadding gap="XS">
    <Label size="S">Trigger</Label>
    <div class="item-list">
      {#each triggers as [_, trigger]}
        <div
          class="item"
          class:selected={selectedTrigger === trigger.name}
          on:click={() => selectTrigger(trigger)}
        >
          <div class="item-body">
            <Icon name={trigger.icon} />
            <span class="icon-spacing">
              <Body size="S">{trigger.name}</Body></span
            >
          </div>
        </div>
      {/each}
    </div>
  </Layout>
</ModalContent>

<style>
  .icon-spacing {
    margin-left: var(--spacing-m);
  }
  .item-body {
    display: flex;
    margin-left: var(--spacing-m);
  }
  .item-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    grid-gap: var(--spectrum-alias-grid-baseline);
  }

  .item {
    cursor: pointer;
    display: grid;
    grid-gap: var(--spectrum-alias-grid-margin-xsmall);
    padding: var(--spectrum-alias-item-padding-s);
    background: var(--spectrum-alias-background-color-secondary);
    transition: 0.3s all;
    border-radius: 5px;
    box-sizing: border-box;
    border-width: 2px;
  }

  .item:hover {
    background: var(--spectrum-alias-background-color-tertiary);
  }
  .selected {
    background: var(--spectrum-alias-background-color-tertiary);
  }
</style>
