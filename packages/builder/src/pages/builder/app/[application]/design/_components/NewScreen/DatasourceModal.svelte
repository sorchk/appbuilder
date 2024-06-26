<script>
  import { ModalContent, Layout, notifications, Body } from "@budibase/bbui"
  import { datasources } from "stores/builder"
  import ICONS from "components/backend/DatasourceNavigator/icons"
  import { IntegrationNames } from "constants"
  import { onMount } from "svelte"
  import DatasourceTemplateRow from "./DatasourceTemplateRow.svelte"

  export let onCancel
  export let onConfirm

  let selectedSources = []

  $: filteredSources = $datasources.list?.filter(datasource => {
    return datasource.source !== IntegrationNames.REST && datasource["entities"]
  })

  const toggleSelection = datasource => {
    const exists = selectedSources.find(
      d => d.resourceId === datasource.resourceId
    )
    if (exists) {
      selectedSources = selectedSources.filter(
        d => d.resourceId === datasource.resourceId
      )
    } else {
      selectedSources = [...selectedSources, datasource]
    }
  }

  const confirmDatasourceSelection = async () => {
    await onConfirm({
      datasources: selectedSources,
    })
  }

  onMount(async () => {
    try {
      await datasources.fetch()
    } catch (error) {
      notifications.error("Error fetching datasources")
    }
  })
</script>

<span>
  <ModalContent
    title="自动生成的屏幕"
    confirmText="确认"
    cancelText="返回"
    onConfirm={confirmDatasourceSelection}
    {onCancel}
    disabled={!selectedSources.length}
    size="L"
  >
    <Body size="S">
      选择要用于创建屏幕的数据源
    </Body>
    <Layout noPadding gap="S">
      {#each filteredSources as datasource}
        {@const entities = Array.isArray(datasource.entities)
          ? datasource.entities
          : Object.values(datasource.entities || {})}
        <div class="data-source-wrap">
          <div class="data-source-header">
            <svelte:component
              this={ICONS[datasource.source]}
              height="24"
              width="24"
            />
            <div class="data-source-name">{datasource.name}</div>
          </div>
          <!-- List all tables -->
          {#each entities.filter(table => table._id !== "ta_users") as table}
            {@const views = Object.values(table.views || {}).filter(
              view => view.version === 2
            )}
            {@const tableDS = {
              tableId: table._id,
              label: table.name,
              resourceId: table._id,
              type: "table",
            }}
            {@const selected = selectedSources.find(
              datasource => datasource.resourceId === tableDS.resourceId
            )}
            <DatasourceTemplateRow
              on:click={() => toggleSelection(tableDS)}
              {selected}
              datasource={tableDS}
            />

            <!-- List all views inside this table -->
            {#each views as view}
              {@const viewDS = {
                label: view.name,
                id: view.id,
                resourceId: view.id,
                tableId: view.tableId,
                type: "viewV2",
              }}
              {@const selected = selectedSources.find(
                x => x.resourceId === viewDS.resourceId
              )}
              <DatasourceTemplateRow
                on:click={() => toggleSelection(viewDS)}
                {selected}
                datasource={viewDS}
              />
            {/each}
          {/each}
        </div>
      {/each}
    </Layout>
  </ModalContent>
</span>

<style>
  .data-source-wrap {
    padding-bottom: var(--spectrum-alias-item-padding-s);
    display: grid;
    grid-gap: var(--spacing-s);
  }
  .data-source-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
    padding-bottom: var(--spacing-xs);
  }
</style>
