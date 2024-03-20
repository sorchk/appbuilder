<script>
  import { views, viewsV2 } from "stores/builder"
  import { cloneDeep } from "lodash/fp"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import {
    notifications,
    Icon,
    Input,
    ActionMenu,
    MenuItem,
    Modal,
    ModalContent,
  } from "@budibase/bbui"

  export let view

  let editorModal
  let originalName
  let updatedName
  let confirmDeleteDialog

  async function save() {
    const updatedView = cloneDeep(view)
    updatedView.name = updatedName

    if (view.version === 2) {
      await viewsV2.save({
        originalName,
        ...updatedView,
      })
    } else {
      await views.save({
        originalName,
        ...updatedView,
      })
    }

    notifications.success("视图重命名成功")
  }

  async function deleteView() {
    try {
      if (view.version === 2) {
        await viewsV2.delete(view)
      } else {
        await views.delete(view)
      }
      notifications.success("视图已删除")
    } catch (error) {
      notifications.error("删除视图时出错")
    }
  }

  const initForm = () => {
    updatedName = view.name + ""
    originalName = view.name + ""
  }
</script>

<ActionMenu>
  <div slot="control" class="icon open-popover">
    <Icon s hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Edit" on:click={editorModal.show}>编辑</MenuItem>
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}>删除</MenuItem>
</ActionMenu>
<Modal bind:this={editorModal} on:show={initForm}>
  <ModalContent title="编辑视图" onConfirm={save} confirmText="保存">
    <Input label="视图名" thin bind:value={updatedName} />
  </ModalContent>
</Modal>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  body={`是否确实要删除视图 '${view.name}'? 您的数据将被删除，此操作无法撤消。`}
  okText="删除视图"
  onOk={deleteView}
  title="确认删除"
/>
