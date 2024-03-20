<script>
  import { Body, ModalContent, notifications } from "@budibase/bbui"
  import { plugins } from "stores/portal"
  import { createEventDispatcher } from "svelte"

  export let plugin

  let dispatch = createEventDispatcher()

  async function deletePlugin() {
    try {
      const name = plugin.name
      await plugins.deletePlugin(plugin._id)
      notifications.success(`Plugin ${name} deleted successfully`)
      dispatch("deleted")
    } catch (error) {
      const msg = error?.message ? error.message : JSON.stringify(error)
      notifications.error(`Error deleting plugin: ${msg}`)
    }
  }
</script>

<ModalContent
  warning
  onConfirm={deletePlugin}
  title="删除插件"
  confirmText="删除插件"
  cancelText="取消"
  showCloseIcon={false}
>
  <Body>
    你确定要删除吗 <strong>{plugin?.name}</strong>?
  </Body>
</ModalContent>
