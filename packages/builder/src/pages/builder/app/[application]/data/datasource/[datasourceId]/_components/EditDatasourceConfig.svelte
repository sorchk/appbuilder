<script>
  import { keepOpen, Modal, notifications } from "@budibase/bbui"
  import { integrationForDatasource } from "stores/selectors"
  import { datasources, integrations } from "stores/builder"
  import DatasourceConfigEditor from "components/backend/Datasources/ConfigEditor/index.svelte"
  import EditDatasourceConfigButton from "./EditDatasourceConfigButton.svelte"

  export let datasource

  $: integration = integrationForDatasource($integrations, datasource)

  let modal

  async function saveDatasource({ config, name }) {
    try {
      await datasources.update({
        integration,
        datasource: { ...datasource, config, name },
      })

      notifications.success(
        `数据源 ${datasource.name} 更新成功`
      )
    } catch (err) {
      notifications.error(err?.message ?? "保存数据源时出错")

      return keepOpen
    }
  }
</script>

<EditDatasourceConfigButton on:click={modal.show} {datasource} />
<Modal bind:this={modal}>
  <DatasourceConfigEditor
    {integration}
    config={datasource.config}
    showNameField
    nameFieldValue={datasource.name}
    onSubmit={saveDatasource}
  />
</Modal>
