<script>
  import { API } from "api"
  import {
    tables,
    datasources,
    sortedIntegrations as integrations,
  } from "stores/builder"

  import { hasData } from "stores/selectors"
  import { notifications, Body, Icon, AbsTooltip } from "@budibase/bbui"
  import { params, goto } from "@roxi/routify"
  import CreateExternalDatasourceModal from "./_components/CreateExternalDatasourceModal/index.svelte"
  import CreateInternalTableModal from "./_components/CreateInternalTableModal.svelte"
  import DatasourceOption from "./_components/DatasourceOption.svelte"
  import IntegrationIcon from "components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import CreationPage from "components/common/CreationPage.svelte"
  import ICONS from "components/backend/DatasourceNavigator/icons/index.js"

  let internalTableModal
  let externalDatasourceModal

  let sampleDataLoading = false
  let externalDatasourceLoading = false

  $: disabled = sampleDataLoading || externalDatasourceLoading

  const createSampleData = async () => {
    sampleDataLoading = true

    try {
      await API.addSampleData($params.application)
      await tables.fetch()
      await datasources.fetch()
      $goto("./table")
    } catch (e) {
      sampleDataLoading = false
      notifications.error("Error creating datasource")
    }
  }
</script>

<CreateInternalTableModal bind:this={internalTableModal} />

<CreateExternalDatasourceModal
  bind:loading={externalDatasourceLoading}
  bind:this={externalDatasourceModal}
/>

<CreationPage
  showClose={hasData($datasources, $tables)}
  onClose={() => $goto("./table")}
  heading="添加新数据源"
>
  <div class="subHeading">
    <Body>开始使用我们的Budibase数据库</Body>
    <AbsTooltip text="Budibase DB是用CouchDB构建的">
      <Icon name="Info" size="S" />
    </AbsTooltip>
  </div>

  <div class="options">
    <DatasourceOption
      on:click={internalTableModal.show}
      title="创建新表"
      description="非关系型"
      {disabled}
    >
      <svelte:component this={ICONS.BUDIBASE} height="20" width="20" />
    </DatasourceOption>
    <DatasourceOption
      on:click={createSampleData}
      title="使用示例数据"
      description="非关系型"
      disabled={disabled || $datasources.hasDefaultData}
    >
      <svelte:component this={ICONS.BUDIBASE} height="20" width="20" />
    </DatasourceOption>
    <DatasourceOption
      on:click={() => internalTableModal.show({ promptUpload: true })}
      title="上传CSV/JSON"
      description="非关系型"
      {disabled}
    >
      <svelte:component this={ICONS.BUDIBASE} height="20" width="20" />
    </DatasourceOption>
  </div>

  <div class="subHeading">
    <Body>或者连接到外部数据源</Body>
  </div>

  <div class="options">
    {#each $integrations as integration}
      <DatasourceOption
        on:click={() => externalDatasourceModal.show(integration)}
        title={integration.friendlyName}
        description={integration.type}
        {disabled}
      >
        <IntegrationIcon
          integrationType={integration.name}
          schema={integration}
        />
      </DatasourceOption>
    {/each}
  </div>
</CreationPage>

<style>
  .subHeading {
    display: flex;
    align-items: center;
    margin-top: 12px;
    margin-bottom: 36px;
    gap: 8px;
  }
  .subHeading :global(p) {
    color: var(--spectrum-global-color-gray-600) !important;
  }
  .options {
    width: 100%;
    display: grid;
    column-gap: 24px;
    row-gap: 24px;
    grid-template-columns: repeat(auto-fit, 235px);
    justify-content: center;
    margin-bottom: 48px;
    max-width: 1050px;
  }
</style>
