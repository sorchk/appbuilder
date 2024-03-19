<script>
  import { get } from "svelte/store"
  import { isEqual } from "lodash"
  import { integrationForDatasource } from "stores/selectors"
  import { integrations, datasources } from "stores/builder"
  import { notifications, Button } from "@budibase/bbui"

  export let datasource
  export let updatedDatasource

  $: hasChanged = !isEqual(datasource, updatedDatasource)

  const save = async () => {
    try {
      const integration = integrationForDatasource(
        get(integrations),
        updatedDatasource
      )
      await datasources.update({ datasource: updatedDatasource, integration })
      notifications.success(
        `数据源 ${updatedDatasource.name} 更新成功`
      )
    } catch (error) {
      notifications.error(`保存数据源时出错: ${error.message}`)
    }
  }
</script>

<Button disabled={!hasChanged} cta on:click={save}>Save</Button>
