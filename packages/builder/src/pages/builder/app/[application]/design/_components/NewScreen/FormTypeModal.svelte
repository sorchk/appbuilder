<script>
  import { ModalContent, Layout, Body, Icon } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  export let onCancel = () => {}
  export let onConfirm = () => {}
  export let type

  const dispatch = createEventDispatcher()
</script>

<span>
  <ModalContent
    title="选择表单类型"
    confirmText="完成"
    cancelText="返回"
    {onConfirm}
    {onCancel}
    disabled={!type}
    size="L"
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <Layout noPadding gap="S">
      <div
        class="form-type"
        class:selected={type === "Create"}
        on:click={() => {
          dispatch("select", "Create")
        }}
      >
        <div class="form-type-wrap">
          <div class="form-type-content">
            <Body noPadding>创建新行</Body>
            <Body size="S">
              用于捕获和存储用户的新数据
            </Body>
          </div>
          {#if type === "Create"}
            <span class="form-type-check">
              <Icon size="S" name="CheckmarkCircle" />
            </span>
          {/if}
        </div>
      </div>
      <div
        class="form-type"
        class:selected={type === "Update"}
        on:click={() => {
          dispatch("select", "Update")
        }}
      >
        <div class="form-type-wrap">
          <div class="form-type-content">
            <Body noPadding>更新现有行</Body>
            <Body size="S">用于查看和更新现有数据</Body>
          </div>
          {#if type === "Update"}
            <span class="form-type-check">
              <Icon size="S" name="CheckmarkCircle" />
            </span>
          {/if}
        </div>
      </div>
      <div
        class="form-type"
        class:selected={type === "View"}
        on:click={() => {
          dispatch("select", "View")
        }}
      >
        <div class="form-type-wrap">
          <div class="form-type-content">
            <Body noPadding>查看现有行</Body>
            <Body size="S">用于数据的只读视图</Body>
          </div>
          {#if type === "View"}
            <span class="form-type-check">
              <Icon size="S" name="CheckmarkCircle" />
            </span>
          {/if}
        </div>
      </div>
    </Layout>
  </ModalContent>
</span>

<style>
  .form-type {
    cursor: pointer;
    gap: var(--spacing-s);
    padding: var(--spacing-m) var(--spacing-xl);
    background: var(--spectrum-alias-background-color-secondary);
    transition: 0.3s all;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
  }
  .selected,
  .form-type:hover {
    background: var(--spectrum-alias-background-color-tertiary);
  }
  .form-type-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .form-type :global(p:nth-child(2)) {
    color: var(--grey-6);
  }
  .form-type-check {
    margin-left: auto;
  }
  .form-type-check :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-green-600);
  }
  .form-type-content {
    gap: var(--spacing-s);
    display: flex;
    flex-direction: column;
  }
</style>
