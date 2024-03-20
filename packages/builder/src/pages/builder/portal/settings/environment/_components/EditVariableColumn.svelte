<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { environment } from "stores/portal"
  import CreateEditVariableModal from "components/portal/environment/CreateEditVariableModal.svelte"

  export let row

  let editVariableModal
  let deleteDialog

  const save = async data => {
    await environment.updateVariable(data)
    editVariableModal.hide()
  }
</script>

<ActionButton size="S" on:click={editVariableModal.show}>Edit</ActionButton>

<Modal bind:this={editVariableModal}>
  <CreateEditVariableModal {row} {save} />
</Modal>

<ConfirmDialog
  bind:this={deleteDialog}
  onOk={async () => {
    await environment.deleteVariable(row.name)
  }}
  okText="删除环境变量"
  title="确认删除"
>
  Are you sure you wish to delete the environment variable
  <i>{row.name}?</i>
  This action cannot be undone.
</ConfirmDialog>
