<script>
  import { Input, Modal, notifications, ModalContent } from "@budibase/bbui"
  import { appStore, initialise } from "stores/builder"
  import { API } from "api"

  export let onComplete = () => {}

  let revertModal
  let appName

  $: appId = $appStore.appId

  const revert = async () => {
    try {
      await API.revertAppChanges(appId)

      // Reset frontend state after revert
      const applicationPkg = await API.fetchAppPackage(appId)
      await initialise(applicationPkg)
      notifications.info("更改已成功恢复")
      onComplete()
    } catch (error) {
      notifications.error(`还原更改时出错: ${error}`)
    }
  }

  export const hide = () => {
    revertModal.hide()
  }

  export const show = () => {
    revertModal.show()
  }
</script>

<Modal bind:this={revertModal}>
  <ModalContent
    title="Revert Changes"
    confirmText="Revert"
    onConfirm={revert}
    disabled={appName !== $appStore.name}
  >
    <span
      >您所做的更改将被删除并恢复应用程序回到生产状态。</span
    >
    <span>请输入您的应用程序名称以继续。</span>
    <Input bind:value={appName} />
  </ModalContent>
</Modal>
