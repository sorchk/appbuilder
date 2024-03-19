<script>
  import { goto } from "@roxi/routify"
  import { ActionMenu, MenuItem, Icon, notifications } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { datasources, queries } from "stores/builder"

  export let query

  let confirmDeleteDialog

  async function deleteQuery() {
    try {
      // Go back to the datasource if we are deleting the active query
      if ($queries.selectedQueryId === query._id) {
        $goto(`./datasource/${query.datasourceId}`)
      }
      await queries.delete(query)
      await datasources.fetch()
      notifications.success("查询已删除")
    } catch (error) {
      notifications.error("删除查询时出错")
    }
  }

  async function duplicateQuery() {
    try {
      const newQuery = await queries.duplicate(query)
      $goto(`./query/${newQuery._id}`)
    } catch (error) {
      notifications.error("复制查询时出错")
    }
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}>删除</MenuItem>
  <MenuItem icon="Duplicate" on:click={duplicateQuery}>复制</MenuItem>
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="删除查询"
  onOk={deleteQuery}
  title="确认删除"
>
您确定要删除此查询吗？此操作无法撤消。
</ConfirmDialog>

<style>
  div.icon {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
</style>
