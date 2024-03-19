<script>
  import { ActionButton, Popover, Heading, Body, Button } from "@budibase/bbui"
  import { builderStore } from "stores/builder"

  let anchor
  let open = false

  const openSidePanel = () => {
    builderStore.showBuilderSidePanel()
    open = false
  }
</script>

<div bind:this={anchor}>
  <ActionButton on:click={() => (open = true)} icon="Help" quiet>
    为什么我不能编辑此表？
  </ActionButton>
</div>

<Popover bind:open {anchor} align="left">
  <div class="content">
    <Heading size="XS">应用程序用户表是只读的</Heading>
    <Body size="S">
      您可以继续查看有权访问您的应用程序的用户。
    </Body>
    <Body size="S">
      使用中的用户侧面板管理和邀请更多应用程序用户屏幕右上角。
    </Body>
    <div class="button">
      <Button cta on:click={openSidePanel}>打开用户面板</Button>
    </div>
  </div>
</Popover>

<style>
  .content {
    width: 300px;
    padding: var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }
  .content :global(.spectrum-Heading) {
    font-weight: 400;
  }
  .button {
    display: flex;
    justify-content: flex-end;
  }
</style>
