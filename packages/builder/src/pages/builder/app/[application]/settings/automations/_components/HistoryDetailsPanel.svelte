<script>
  import {
    Layout,
    Body,
    Button,
    InlineAlert,
    Heading,
    Icon,
  } from "@budibase/bbui"
  import StatusRenderer from "./StatusRenderer.svelte"
  import DateTimeRenderer from "components/common/renderers/DateTimeRenderer.svelte"
  import TestDisplay from "components/automation/AutomationBuilder/TestDisplay.svelte"
  import { goto } from "@roxi/routify"
  import { automationStore } from "stores/builder"

  export let history
  export let appId
  export let close
  const STOPPED_ERROR = "stopped_error"

  $: exists = $automationStore.automations?.find(
    auto => auto._id === history?.automationId
  )
</script>

{#if history}
  <Layout noPadding>
    <div class="controls">
      <StatusRenderer value={history.status} />
      <Icon hoverable name="Close" on:click={close} />
    </div>
    <Layout noPadding gap="XS">
      <Heading>{history.automationName}</Heading>
      <DateTimeRenderer value={history.createdAt} />
    </Layout>
    {#if history.status === STOPPED_ERROR}
      <div class="cron-error">
        <InlineAlert
          type="error"
          header="CRON自动化已禁用"
          message="修复错误并重新发布您的应用程序以重新激活。"
        />
      </div>
    {/if}
    {#if exists}
      <div>
        <Button
          secondary
          on:click={() => {
            $goto(`/builder/app/${appId}/automation/${history.automationId}`)
          }}
        >
        编辑自动化
        </Button>
      </div>
    {/if}
    {#key history}
      <div class="history">
        <TestDisplay testResults={history} width="320px" />
      </div>
    {/key}
  </Layout>
{:else}
  <Body>未找到详细信息</Body>
{/if}

<style>
  .controls {
    display: flex;
    gap: var(--spacing-s);
    justify-content: space-between;
    align-items: center;
  }
  .cron-error {
    display: flex;
    width: 100%;
    justify-content: center;
  }
  .history {
    margin: 0 -30px;
  }
</style>
