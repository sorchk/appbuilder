<script>
  import formatHighlight from "json-format-highlight"
  import { Icon, ProgressCircle, notifications } from "@budibase/bbui"
  import { copyToClipboard } from "@budibase/bbui/helpers"
  import { fade } from "svelte/transition"

  export let expressionResult
  export let evaluating = false
  export let expression = null

  $: error = expressionResult === "Error while executing JS"
  $: empty = expression == null || expression?.trim() === ""
  $: success = !error && !empty
  $: highlightedResult = highlight(expressionResult)

  const highlight = json => {
    if (json == null) {
      return ""
    }
    // Attempt to parse and then stringify, in case this is valid JSON
    try {
      json = JSON.stringify(JSON.parse(json), null, 2)
    } catch (err) {
      // Ignore
    }
    return formatHighlight(json, {
      keyColor: "#e06c75",
      numberColor: "#e5c07b",
      stringColor: "#98c379",
      trueColor: "#d19a66",
      falseColor: "#d19a66",
      nullColor: "#c678dd",
    })
  }

  const copy = () => {
    let clipboardVal = expressionResult
    if (typeof clipboardVal === "object") {
      clipboardVal = JSON.stringify(clipboardVal, null, 2)
    }
    copyToClipboard(clipboardVal)
    notifications.success("Value copied to clipboard")
  }
</script>

<div class="evaluation-side-panel">
  <div class="header" class:success class:error>
    <div class="header-content">
      {#if error}
        <Icon name="Alert" color="var(--spectrum-global-color-red-600)" />
        <div>错误</div>
        {#if evaluating}
          <div transition:fade|local={{ duration: 130 }}>
            <ProgressCircle size="S" />
          </div>
        {/if}
        <span />
        <Icon name="Copy" size="S" hoverable on:click={copy} />
      {:else}
        <div>预览</div>
        {#if evaluating}
          <div transition:fade|local={{ duration: 130 }}>
            <ProgressCircle size="S" />
          </div>
        {/if}
        <span />
        {#if !empty}
          <Icon name="Copy" newStyles size="S" hoverable on:click={copy} />
        {/if}
      {/if}
    </div>
  </div>
  <div class="body">
    {#if empty}
    您的表达式将在此处进行评估
    {:else}
      <!-- eslint-disable-next-line svelte/no-at-html-tags-->
      {@html highlightedResult}
    {/if}
  </div>
</div>

<style>
  .evaluation-side-panel {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    border-left: var(--border-light);
  }
  .header {
    padding: var(--spacing-m) var(--spacing-l);
    flex: 0 0 auto;
    position: relative;
    border-bottom: var(--border-light);
  }
  .header-content {
    height: var(--spectrum-alias-item-height-m);
    display: flex;
    align-items: center;
    z-index: 2;
    position: relative;
    gap: var(--spacing-m);
  }
  .header-content span {
    flex: 1 1 auto;
  }
  .header.error::before {
    content: "";
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    position: absolute;
    opacity: 10%;
  }
  .header.error::before {
    background: var(--spectrum-global-color-red-400);
  }
  .body {
    flex: 1 1 auto;
    padding: var(--spacing-m) var(--spacing-l);
    font-family: var(--font-mono);
    font-size: 12px;
    overflow-y: scroll;
    overflow-x: hidden;
    white-space: pre-wrap;
    word-wrap: break-word;
    height: 0;
  }
</style>
