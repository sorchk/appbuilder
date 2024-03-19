<script>
  import { Input, notifications } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { appsStore } from "stores/portal"
  import { API } from "api"

  export let appId
  export let appName
  export let onDeleteSuccess = () => {
    $goto("/builder")
  }

  let deleting = false

  export const show = () => {
    deletionModal.show()
  }

  export const hide = () => {
    deletionModal.hide()
  }

  let deletionModal
  let deletionConfirmationAppName

  const copyName = () => {
    deletionConfirmationAppName = appName
  }

  const deleteApp = async () => {
    if (!appId) {
      console.error("未提供应用程序id")
      return
    }
    deleting = true
    try {
      await API.deleteApp(appId)
      appsStore.load()
      notifications.success("应用程序删除成功")
      onDeleteSuccess()
    } catch (err) {
      notifications.error("删除应用程序时出错")
      deleting = false
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<ConfirmDialog
  bind:this={deletionModal}
  title="删除应用"
  okText="删除"
  onOk={deleteApp}
  onCancel={() => (deletionConfirmationAppName = null)}
  disabled={deletionConfirmationAppName !== appName || deleting}
>
您确定要删除吗
  <span class="app-name" role="button" tabindex={-1} on:click={copyName}>
    {appName}
  </span>?
  <br />
  请在下面输入应用程序名称进行确认。
  <br /><br />
  <Input bind:value={deletionConfirmationAppName} placeholder={appName} />
</ConfirmDialog>

<style>
  .app-name {
    cursor: pointer;
    font-weight: bold;
    display: inline-block;
  }
</style>
