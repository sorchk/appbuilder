<script>
  import {
    Layout,
    Divider,
    Heading,
    Body,
    Button,
    Label,
    Modal,
    Icon,
  } from "@budibase/bbui"
  import { AppStatus } from "constants"
  import { appStore, initialise } from "stores/builder"
  import { appsStore } from "stores/portal"
  import UpdateAppModal from "components/start/UpdateAppModal.svelte"
  import { API } from "api"

  let updatingModal

  $: filteredApps = $appsStore.apps.filter(app => app.devId == $appStore.appId)
  $: app = filteredApps.length ? filteredApps[0] : {}
  $: appDeployed = app?.status === AppStatus.DEPLOYED

  const initialiseApp = async () => {
    const applicationPkg = await API.fetchAppPackage($appStore.appId)
    await initialise(applicationPkg)
  }
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading>名称和URL</Heading>
    <Body>编辑应用的名称和URL</Body>
  </Layout>
  <Divider />

  <Layout noPadding gap="XXS">
    <Label size="L">名称</Label>
    <Body>{$appStore?.name}</Body>
  </Layout>

  <Layout noPadding gap="XS">
    <Label size="L">图标</Label>
    <div class="icon">
      <Icon
        size="L"
        name={$appStore?.icon?.name || "应用"}
        color={$appStore?.icon?.color}
      />
    </div>
  </Layout>

  <Layout noPadding gap="XXS">
    <Label size="L">URL</Label>
    <Body>{$appStore.url}</Body>
  </Layout>

  <div>
    <Button
      cta
      on:click={() => {
        updatingModal.show()
      }}
      disabled={appDeployed}
      tooltip={appDeployed
        ? "您必须取消发布应用程序才能进行更改"
        : null}
    >
      编辑
    </Button>
  </div>
</Layout>

<Modal bind:this={updatingModal} padding={false} width="600px">
  <UpdateAppModal
    app={{
      name: $appStore.name,
      url: $appStore.url,
      icon: $appStore.icon,
      appId: $appStore.appId,
    }}
    onUpdateComplete={async () => {
      await initialiseApp()
    }}
  />
</Modal>

<style>
  .icon {
    display: flex;
    justify-content: flex-start;
  }
</style>
