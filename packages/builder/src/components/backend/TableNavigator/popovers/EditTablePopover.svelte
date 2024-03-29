<script>
  import { goto, params } from "@roxi/routify"
  import { cloneDeep } from "lodash/fp"
  import { tables, datasources, screenStore } from "stores/builder"
  import {
    ActionMenu,
    Icon,
    Input,
    MenuItem,
    Modal,
    ModalContent,
    notifications,
  } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { DB_TYPE_EXTERNAL } from "constants/backend"

  export let table

  let editorModal, editTableNameModal
  let confirmDeleteDialog
  let error = ""

  let originalName
  let updatedName

  let templateScreens
  let willBeDeleted
  let deleteTableName

  $: externalTable = table?.sourceType === DB_TYPE_EXTERNAL

  function showDeleteModal() {
    templateScreens = $screenStore.screens.filter(
      screen => screen.autoTableId === table._id
    )
    willBeDeleted = ["All table data"].concat(
      templateScreens.map(screen => `Screen ${screen.routing?.route || ""}`)
    )
    confirmDeleteDialog.show()
  }

  async function deleteTable() {
    const isSelected = $params.tableId === table._id
    try {
      await tables.delete(table)
      // Screens need deleted one at a time because of undo/redo
      for (let screen of templateScreens) {
        await screenStore.delete(screen)
      }
      if (table.sourceType === DB_TYPE_EXTERNAL) {
        await datasources.fetch()
      }
      notifications.success("表已删除")
      if (isSelected) {
        $goto(`./datasource/${table.datasourceId}`)
      }
    } catch (error) {
      notifications.error(`删除表时出错 - ${error.message}`)
    }
  }

  function hideDeleteDialog() {
    deleteTableName = ""
  }

  async function save() {
    const updatedTable = cloneDeep(table)
    updatedTable.name = updatedName
    await tables.save(updatedTable)
    await datasources.fetch()
    notifications.success("已成功重命名表")
  }

  function checkValid(evt) {
    const tableName = evt.target.value
    error =
      originalName === tableName
        ? `名为 ${tableName} 的表已存在。请选择其他名称。`
        : ""
  }

  const initForm = () => {
    originalName = table.name + ""
    updatedName = table.name + ""
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon s hoverable name="MoreSmallList" />
  </div>
  {#if !externalTable}
    <MenuItem icon="Edit" on:click={editorModal.show}>编辑</MenuItem>
  {/if}
  <MenuItem icon="Delete" on:click={showDeleteModal}>删除</MenuItem>
</ActionMenu>

<Modal bind:this={editorModal} on:show={initForm}>
  <ModalContent
    bind:this={editTableNameModal}
    title="编辑表"
    confirmText="保存"
    onConfirm={save}
    disabled={updatedName === originalName || error}
  >
    <form on:submit|preventDefault={() => editTableNameModal.confirm()}>
      <Input
        label="表名"
        thin
        bind:value={updatedName}
        on:input={checkValid}
        {error}
      />
    </form>
  </ModalContent>
</Modal>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="删除表"
  onOk={deleteTable}
  onCancel={hideDeleteDialog}
  title="确认删除"
  disabled={deleteTableName !== table.name}
>
  <p>
    你确定要删除该表吗
    <b>{table.name}?</b>
    以下内容也将被删除：
  </p>
  <b>
    <div class="delete-items">
      {#each willBeDeleted as item}
        <div>{item}</div>
      {/each}
    </div>
  </b>
  <p>此操作无法撤消-若要继续，请在下面输入表名以确认。</p>
  <Input bind:value={deleteTableName} placeholder={table.name} />
</ConfirmDialog>

<style>
  div.icon {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  div.delete-items {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 10px;
  }

  div.delete-items div {
    margin-top: 4px;
    font-weight: 600;
  }
</style>
