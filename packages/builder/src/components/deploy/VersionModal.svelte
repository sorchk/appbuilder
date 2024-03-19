<script>
  import {
    Modal,
    notifications,
    ModalContent,
    Body,
    Button,
    StatusLight,
  } from "@budibase/bbui"
  import { appStore, initialise } from "stores/builder"
  import { API } from "api"

  export function show() {
    updateModal.show()
  }

  export function hide() {
    updateModal.hide()
  }

  export let onComplete = () => {}
  export let hideIcon = false

  let updateModal

  $: appId = $appStore.appId
  $: updateAvailable =
    $appStore.upgradableVersion &&
    $appStore.version &&
    $appStore.upgradableVersion !== $appStore.version
  $: revertAvailable = $appStore.revertableVersion != null

  const refreshAppPackage = async () => {
    try {
      const pkg = await API.fetchAppPackage(appId)
      await initialise(pkg)
    } catch (error) {
      notifications.error("Error fetching app package")
    }
  }

  const update = async () => {
    try {
      await API.updateAppClientVersion(appId)

      // Don't wait for the async refresh, since this causes modal flashing
      refreshAppPackage()
      notifications.success(
        `应用程序已成功更新到版本 ${$appStore.upgradableVersion}`
      )
      onComplete()
    } catch (err) {
      notifications.error(`更新应用程序时出错: ${err}`)
    }
    updateModal.hide()
  }

  const revert = async () => {
    try {
      await API.revertAppClientVersion(appId)

      // Don't wait for the async refresh, since this causes modal flashing
      refreshAppPackage()
      notifications.success(
        `应用程序成功恢复到版本 ${$appStore.revertableVersion}`
      )
    } catch (err) {
      notifications.error(`还原应用程序时出错: ${err}`)
    }
    updateModal.hide()
  }
</script>

{#if !hideIcon && updateAvailable}
  <StatusLight hoverable on:click={updateModal.show} notice>Update</StatusLight>
{/if}
<Modal bind:this={updateModal}>
  <ModalContent
    title="应用程序版本"
    confirmText="更新"
    cancelText={updateAvailable ? "Cancel" : "Close"}
    onConfirm={update}
    showConfirmButton={updateAvailable}
  >
    <div slot="footer">
      {#if revertAvailable}
        <Button quiet secondary on:click={revert}>Revert</Button>
      {/if}
    </div>
    {#if updateAvailable}
      <Body size="S">
        此应用程序当前使用的版本为 <b>{$appStore.version}</b>, 但是版本
        <b>{$appStore.upgradableVersion}</b> 可用。更新可以包含新的功能、性能改进和错误修复。
      </Body>
    {:else}
      <Body size="S">
        此应用程序当前使用的版本是 <b>{$appStore.version}</b> 可用的最新版本。
      </Body>
    {/if}
    {#if revertAvailable}
      <Body size="S">
        您可以将此应用还原为版本
        <b>{$appStore.revertableVersion}</b>
        如果您遇到当前版本的问题。
      </Body>
    {/if}
  </ModalContent>
</Modal>
