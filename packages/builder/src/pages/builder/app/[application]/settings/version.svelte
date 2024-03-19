<script>
  import { Layout, Heading, Body, Divider, Button } from "@budibase/bbui"
  import { isOnlyUser, appStore } from "stores/builder"
  import VersionModal from "components/deploy/VersionModal.svelte"

  let versionModal

  $: updateAvailable = $appStore.upgradableVersion !== $appStore.version
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading>版本</Heading>
    <Body>查看应用程序的当前版本并检查更新</Body>
  </Layout>
  <Divider />
  {#if updateAvailable}
    <Body>
      该应用程序当前使用的版本为 <strong>{$appStore.version}</strong>
      但版本 <strong>{$appStore.upgradableVersion}</strong> 可用.
      <br />
      更新可以包含新功能、性能改进和错误修复。
    </Body>
    <div>
      <Button
        cta
        on:click={versionModal.show}
        disabled={!$isOnlyUser}
        tooltip={$isOnlyUser
          ? null
          : "不可用-其他用户正在编辑此应用"}
      >
      更新应用
      </Button>
    </div>
  {:else}
    <Body>
      该应用程序当前使用的版本为 <strong>{$appStore.version}</strong>.
      <br />
      你正在运行最新的！
    </Body>
    <div>
      <Button
        secondary
        on:click={versionModal.show}
        tooltip={$isOnlyUser
          ? null
          : "不可用-其他用户正在编辑此应用"}
      >
      还原应用
      </Button>
    </div>
  {/if}
</Layout>

<VersionModal bind:this={versionModal} hideIcon={true} />
