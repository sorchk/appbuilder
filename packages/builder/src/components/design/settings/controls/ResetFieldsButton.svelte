<script>
  import { ActionButton, notifications } from "@budibase/bbui"
  import { selectedScreen, componentStore } from "stores/builder"
  import { findClosestMatchingComponent } from "helpers/components"
  import { makeDatasourceFormComponents } from "templates/commonComponents"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  export let componentInstance

  let confirmResetFieldsDialog

  const resetFormFields = async () => {
    const form = findClosestMatchingComponent(
      $selectedScreen?.props,
      componentInstance._id,
      component => component._component.endsWith("/form")
    )
    const dataSource = form?.dataSource
    const fields = makeDatasourceFormComponents(dataSource)
    try {
      await componentStore.updateSetting(
        "_children",
        fields.map(field => field.json())
      )
    } catch (error) {
      notifications.error("Error resetting form fields")
    }
  }
</script>

<div>
  <ActionButton
    secondary
    wide
    on:click={() => confirmResetFieldsDialog?.show()}
  >
  更新表单字段
  </ActionButton>
</div>

<ConfirmDialog
  bind:this={confirmResetFieldsDialog}
  body={`此组中的所有组件都将被删除，并替换为与架构匹配的字段。是否确实要更新此字段组？`}
  okText="更新"
  onOk={resetFormFields}
  title="确认表单字段更新"
/>
