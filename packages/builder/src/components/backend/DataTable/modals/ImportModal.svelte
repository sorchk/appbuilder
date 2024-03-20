<script>
  import {
    ModalContent,
    Label,
    notifications,
    Body,
    Layout,
  } from "@budibase/bbui"
  import TableDataImport from "../../TableNavigator/ExistingTableDataImport.svelte"
  import { API } from "api"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let tableId
  export let tableType

  let rows = []
  let allValid = false
  let displayColumn = null
  let identifierFields = []

  async function importData() {
    try {
      await API.importTableData({
        tableId,
        rows,
        identifierFields,
      })
      notifications.success("已成功导入行")
    } catch (error) {
      notifications.error("无法导入数据")
    }

    // Always refresh rows just to be sure
    dispatch("importrows")
  }
</script>

<ModalContent
  title="导入数据"
  confirmText="导入"
  onConfirm={importData}
  disabled={!allValid}
>
  <Body size="S">
    将行从CSV或JSON文件导入到现有表中。仅列来自将导入表中存在的文件。
  </Body>
  <Layout gap="XS" noPadding>
    <Label grey extraSmall>要导入的CSV或JSON文件</Label>
    <TableDataImport
      {tableId}
      {tableType}
      bind:rows
      bind:allValid
      bind:displayColumn
      bind:identifierFields
    />
  </Layout>
</ModalContent>
