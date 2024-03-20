<script>
  import { screenStore, componentStore } from "stores/builder"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import {
    ActionMenu,
    MenuItem,
    Icon,
    Modal,
    Helpers,
    notifications,
  } from "@budibase/bbui"
  import ScreenDetailsModal from "components/design/ScreenDetailsModal.svelte"
  import sanitizeUrl from "helpers/sanitizeUrl"
  import { makeComponentUnique } from "helpers/components"

  export let screenId

  let confirmDeleteDialog
  let screenDetailsModal

  $: screen = $screenStore.screens.find(screen => screen._id === screenId)
  $: noPaste = !$componentStore.componentToPaste

  const pasteComponent = mode => {
    try {
      componentStore.paste(screen.props, mode, screen)
    } catch (error) {
      notifications.error("保存组件时出错")
    }
  }

  const duplicateScreen = () => {
    screenDetailsModal.show()
  }

  const createDuplicateScreen = async ({ screenName, screenUrl }) => {
    // Create a dupe and ensure it is unique
    let duplicateScreen = Helpers.cloneDeep(screen)
    delete duplicateScreen._id
    delete duplicateScreen._rev
    duplicateScreen.props = makeComponentUnique(duplicateScreen.props)

    // Attach the new name and URL
    duplicateScreen.routing.route = sanitizeUrl(screenUrl)
    duplicateScreen.routing.homeScreen = false
    duplicateScreen.props._instanceName = screenName

    try {
      // Create the screen
      await screenStore.save(duplicateScreen)
    } catch (error) {
      notifications.error("复制屏幕时出错")
    }
  }

  const deleteScreen = async () => {
    try {
      await screenStore.delete(screen)
      notifications.success("成功删除屏幕")
    } catch (err) {
      notifications.error("删除屏幕时出错")
    }
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem
    icon="ShowOneLayer"
    on:click={() => pasteComponent("inside")}
    disabled={noPaste}
  >
  粘贴到内部
  </MenuItem>
  <MenuItem icon="Duplicate" on:click={duplicateScreen}>复制</MenuItem>
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}>删除</MenuItem>
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="确认删除"
  body={"您确定要删除此屏幕吗？"}
  okText="删除屏幕"
  onOk={deleteScreen}
/>

<Modal bind:this={screenDetailsModal}>
  <ScreenDetailsModal
    onConfirm={createDuplicateScreen}
    screenUrl={screen?.routing.route}
    screenRole={screen?.routing.roleId}
    confirmText="复制"
  />
</Modal>

<style>
  .icon {
    display: grid;
    place-items: center;
  }
</style>
