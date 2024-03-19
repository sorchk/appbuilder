<script>
  import { goto } from "@roxi/routify"
  import { datasources } from "stores/builder"
  import { notifications, ActionMenu, MenuItem, Icon } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import UpdateDatasourceModal from "components/backend/DatasourceNavigator/modals/UpdateDatasourceModal.svelte"
  import { BUDIBASE_DATASOURCE_TYPE } from "constants/backend"

  export let datasource

  let confirmDeleteDialog
  let updateDatasourceDialog

  async function deleteDatasource() {
    try {
      const isSelected = datasource.selected || datasource.containsSelected
      await datasources.delete(datasource)
      notifications.success("数据源已删除")
      if (isSelected) {
        $goto("./datasource")
      }
    } catch (error) {
      notifications.error("删除数据源时出错")
    }
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  {#if datasource.type !== BUDIBASE_DATASOURCE_TYPE}
    <MenuItem icon="Edit" on:click={updateDatasourceDialog.show}>编辑</MenuItem>
  {/if}
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}>删除</MenuItem>
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="删除数据源"
  onOk={deleteDatasource}
  title="确认删除"
>
  是否确实要删除数据源
  <i>{datasource.name}?</i>
  此操作无法撤消。
</ConfirmDialog>
<UpdateDatasourceModal {datasource} bind:this={updateDatasourceDialog} />

<style>
  div.icon {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
</style>
