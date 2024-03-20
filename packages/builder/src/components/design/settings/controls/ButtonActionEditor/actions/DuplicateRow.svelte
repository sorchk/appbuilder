<script>
  import { Select, Label, Body, Checkbox, Input } from "@budibase/bbui"
  import {
    selectedScreen,
    componentStore,
    tables,
    viewsV2,
  } from "stores/builder"
  import { getSchemaForDatasourcePlus } from "dataBinding"
  import SaveFields from "./SaveFields.svelte"
  import { getDatasourceLikeProviders } from "components/design/settings/controls/ButtonActionEditor/actions/utils"

  export let parameters
  export let bindings = []
  export let nested

  $: providerOptions = getDatasourceLikeProviders({
    asset: $selectedScreen,
    componentId: $componentStore.selectedComponentId,
    nested,
  })
  $: schemaFields = getSchemaFields(parameters?.tableId)
  $: tableOptions = $tables.list.map(table => ({
    label: table.name,
    resourceId: table._id,
  }))
  $: viewOptions = $viewsV2.list.map(view => ({
    label: view.name,
    resourceId: view.id,
  }))
  $: options = [...(tableOptions || []), ...(viewOptions || [])]

  const getSchemaFields = resourceId => {
    const { schema } = getSchemaForDatasourcePlus(resourceId)
    return Object.values(schema || {})
  }

  const onFieldsChanged = e => {
    parameters.fields = e.detail
  }
</script>

<div class="root">
  <Body size="S">
    选择提供要复制的行的数据源。
    <br />
    您始终可以手动添加或替代字段。
  </Body>

  <div class="params">
    <Label small>数据源</Label>
    <Select
      bind:value={parameters.providerId}
      options={providerOptions}
      placeholder="None"
    />

    <Label small>复制到表</Label>
    <Select
      bind:value={parameters.tableId}
      {options}
      getOptionLabel={option => option.label}
      getOptionValue={option => option.resourceId}
    />

    <Label small />
    <Checkbox
      text="不显示默认通知"
      bind:value={parameters.notificationOverride}
    />
    <br />
    <Checkbox text="需要确认" bind:value={parameters.confirm} />

    {#if parameters.confirm}
      <Label small>Title</Label>
      <Input
        placeholder="复制行"
        bind:value={parameters.customTitleText}
      />

      <Label small>文本</Label>
      <Input
        placeholder="是否确实要复制此行？"
        bind:value={parameters.confirmText}
      />
    {/if}
  </div>

  {#if parameters.tableId}
    <div class="fields">
      <SaveFields
        parameterFields={parameters.fields}
        {schemaFields}
        on:change={onFieldsChanged}
        {bindings}
      />
    </div>
  {/if}
</div>

<style>
  .root {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xl);
  }

  .root :global(p) {
    line-height: 1.5;
  }

  .params {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 100px 1fr;
    align-items: center;
  }

  .fields {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 100px 1fr auto 1fr auto;
    align-items: center;
  }
</style>
