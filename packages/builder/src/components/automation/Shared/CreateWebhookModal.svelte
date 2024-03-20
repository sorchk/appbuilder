<script>
  import { Icon, notifications, ModalContent } from "@budibase/bbui"
  import { automationStore, selectedAutomation } from "stores/builder"
  import WebhookDisplay from "./WebhookDisplay.svelte"
  import { onMount, onDestroy } from "svelte"

  const POLL_RATE_MS = 2500

  let interval
  let finished = false
  let schemaURL
  let propCount = 0

  $: automation = $selectedAutomation

  onMount(async () => {
    if (!automation?.definition?.trigger?.inputs.schemaUrl) {
      // save the automation initially
      try {
        await automationStore.actions.save(automation)
      } catch (error) {
        notifications.error("保存自动化时出错")
      }
    }
    interval = setInterval(async () => {
      try {
        await automationStore.actions.fetch()
        const outputs =
          automation?.definition?.trigger.schema.outputs?.properties
        // always one prop for the "body"
        if (Object.keys(outputs).length > 1) {
          propCount = Object.keys(outputs).length - 1
          finished = true
        }
      } catch (error) {
        notifications.error("获取自动化列表时出错")
      }
    }, POLL_RATE_MS)
    schemaURL = automation?.definition?.trigger?.inputs.schemaUrl
  })

  onDestroy(() => {
    clearInterval(interval)
  })
</script>

<ModalContent
  title="Webhook设置"
  confirmText="完成"
  showConfirmButton={finished}
  cancelText="跳过"
>
  <p>
    Webhook用于接收数据。为了更容易，请使用URL如下所示，并发送
    <code>POST</code>
    从您的其他应用程序请求它。如果你现在无法做到这一点，那么您可以跳过此步骤，但是我们将无法为配置绑定你以后的行动！
  </p>
  <WebhookDisplay value={schemaURL} />
  {#if finished}
    <p class="finished-text">
      收到请求！我们发现
      {propCount}
      可绑定值 {propCount > 1 ? "s" : ""}.
    </p>
  {/if}
  <a
    slot="footer"
    target="_blank"
    href="https://docs.budibase.com/docs/trigger"
  >
    <Icon name="InfoOutline" />
    <span>了解webhook</span>
  </a>
</ModalContent>

<style>
  a {
    color: var(--ink);
    font-size: 14px;
    vertical-align: middle;
    display: flex;
    align-items: center;
    text-decoration: none;
  }
  a span {
    text-decoration: underline;
    margin-left: var(--spectrum-alias-item-padding-s);
  }
  p {
    margin: 0;
    text-align: justify;
  }
  .finished-text {
    font-weight: 600;
    text-align: center;
    color: var(--blue);
  }
  code {
    padding: 1px 4px 1px 4px;
    font-size: 14px;
    color: var(--grey-7);
    background-color: var(--grey-4);
    border-radius: 2px;
  }
</style>
