<script>
  import { Layout } from "@budibase/bbui"
  import { authStore, appStore, screenStore, componentStore } from "stores"
  import DevToolsStat from "./DevToolsStat.svelte"
</script>

<Layout noPadding gap="XS">
  <DevToolsStat label="应用" value={$appStore.application?.name} />
  <DevToolsStat label="租户" value={$appStore.application?.tenantId} />
  <DevToolsStat label="版本" value={$appStore.application?.version} />
  {#if $appStore.clientLoadTime}
    <DevToolsStat
      label="客户端加载时间"
      value={`${$appStore.clientLoadTime} ms`}
    />
  {/if}
  <DevToolsStat label="应用屏幕" value={$screenStore.screens?.length || 0} />
  <DevToolsStat
    label="活动屏幕"
    value={$screenStore.activeScreen?.routing.route}
  />
  <DevToolsStat
    label="组件"
    value={$componentStore.mountedComponentCount}
  />
  <DevToolsStat label="用户" value={$authStore.email} />
  <DevToolsStat label="角色" value={$authStore.roleId} />
</Layout>
