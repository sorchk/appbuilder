<script>
  import {
    Layout,
    Body,
    Heading,
    Divider,
    ActionButton,
    Modal,
  } from "@budibase/bbui"
  import { AppStatus } from "constants"
  import { appsStore } from "stores/portal"
  import { appStore } from "stores/builder"
  import ExportAppModal from "components/start/ExportAppModal.svelte"
  import ImportAppModal from "components/start/ImportAppModal.svelte"

  $: filteredApps = $appsStore.apps.filter(app => app.devId === $appStore.appId)
  $: app = filteredApps.length ? filteredApps[0] : {}
  $: appDeployed = app?.status === AppStatus.DEPLOYED

  let exportModal, importModal
  let exportPublishedVersion = false

  const exportApp = opts => {
    exportPublishedVersion = !!opts?.published
    exportModal.show()
  }

  const importApp = () => {
    importModal.show()
  }
</script>

<Modal bind:this={exportModal} padding={false}>
  <ExportAppModal {app} published={exportPublishedVersion} />
</Modal>

<Modal bind:this={importModal} padding={false}>
  <ImportAppModal {app} />
</Modal>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading>导出应用</Heading>
    <Body>导出您最新编辑或发布的应用</Body>
  </Layout>
  <div class="body">
    <ActionButton secondary on:click={() => exportApp({ published: false })}>
      导出最新编辑的应用
    </ActionButton>
    <ActionButton
      secondary
      disabled={!appDeployed}
      on:click={() => exportApp({ published: true })}
    >
    导出最新发布的应用
    </ActionButton>
  </div>
  <Divider />
  <Layout gap="XS" noPadding>
    <Heading>导入应用</Heading>
    <Body>导入以更新此应用</Body>
  </Layout>
  <div class="body">
    <ActionButton secondary on:click={() => importApp()}>
      导入应用
    </ActionButton>
  </div>
</Layout>

<style>
  .body {
    display: flex;
    gap: var(--spacing-l);
  }
</style>
