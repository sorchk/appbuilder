<script>
  import { createEventDispatcher } from "svelte"
  import { Button } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  export let selectedRows
  export let deleteRows
  export let item = "row"

  const dispatch = createEventDispatcher()
  let modal

  async function confirmDeletion() {
    await deleteRows(selectedRows)
    modal?.hide()
    dispatch("updaterows")
  }

  $: text = `${item}${selectedRows?.length === 1 ? "" : "s"}`
</script>

<Button icon="Delete" warning quiet on:click={modal.show}>
  删除
  {selectedRows.length}
  {text}
</Button>
<ConfirmDialog
  bind:this={modal}
  okText="删除"
  onOk={confirmDeletion}
  title="确认删除"
>
您确定要删除吗
  {selectedRows.length}
  {text}?
</ConfirmDialog>
