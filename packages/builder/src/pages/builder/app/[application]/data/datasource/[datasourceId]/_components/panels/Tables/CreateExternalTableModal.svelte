<script>
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import { tables, datasources } from "stores/builder"
  import { goto } from "@roxi/routify"
  import { DB_TYPE_EXTERNAL } from "constants/backend"

  export let datasource

  let name = ""
  let submitted = false
  $: valid = name && name.length > 0 && !datasource?.entities?.[name]
  $: error =
    !submitted && name && datasource?.entities?.[name]
      ? "表名称已在使用中。"
      : null

  function buildDefaultTable(tableName, datasourceId) {
    return {
      name: tableName,
      type: "table",
      primary: ["id"],
      sourceId: datasourceId,
      sourceType: DB_TYPE_EXTERNAL,
      schema: {
        id: {
          autocolumn: true,
          type: "number",
        },
      },
    }
  }

  async function saveTable() {
    try {
      submitted = true
      const table = await tables.save(buildDefaultTable(name, datasource._id))
      await datasources.fetch()
      $goto(`../../table/${table._id}`)
    } catch (error) {
      notifications.error(
        `Error saving table - ${error?.message || "未知错误"}`
      )
    }
  }
</script>

<ModalContent
  title="创建新表"
  confirmText="创建"
  onConfirm={saveTable}
  disabled={!valid}
>
  <Body
    >为新表提供一个名称；创建后可以添加列。</Body
  >
  <Input label="表名" bind:error bind:value={name} />
</ModalContent>
