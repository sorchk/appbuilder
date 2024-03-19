<script>
  import { get } from "svelte/store"
  import { datasources, integrations } from "stores/builder"
  import { notifications, Input, ModalContent, Modal } from "@budibase/bbui"
  import { integrationForDatasource } from "stores/selectors"

  let error = ""
  let modal
  let name

  export let datasource
  export let onCancel = undefined

  export const show = () => {
    name = datasource?.name
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }

  function checkValid(evt) {
    const datasourceName = evt.target.value
    if ($datasources?.list.some(ds => ds.name === datasourceName)) {
      error = `名为 ${datasourceName} 的数据源已存在。请选择其他名称。`
      return
    }
    error = ""
  }

  async function updateDatasource() {
    const updatedDatasource = {
      ...datasource,
      name,
    }
    await datasources.update({
      datasource: updatedDatasource,
      integration: integrationForDatasource(get(integrations), datasource),
    })
    notifications.success(`数据源 ${name} 更新成功。`)
    hide()
  }
</script>

<Modal bind:this={modal} on:hide={onCancel}>
  <ModalContent
    title="编辑数据源"
    size="L"
    confirmText="保存"
    onConfirm={updateDatasource}
    disabled={error || !name || !datasource?.type}
  >
    <Input
      label="数据源名称"
      on:input={checkValid}
      bind:value={name}
      {error}
    />
  </ModalContent>
</Modal>
