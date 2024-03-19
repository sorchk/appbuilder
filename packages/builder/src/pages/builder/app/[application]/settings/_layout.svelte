<script>
  import { Content, SideNav, SideNavItem } from "components/portal/page"
  import { Page, Layout, AbsTooltip, TooltipPosition } from "@budibase/bbui"
  import { url, isActive } from "@roxi/routify"
  import DeleteModal from "components/deploy/DeleteModal.svelte"
  import { isOnlyUser, appStore } from "stores/builder"

  let deleteModal
</script>

<!-- routify:options index=4 -->
<div class="settings">
  <Page>
    <Layout title="自动化" noPadding gap="L">
      <Content showMobileNav>
        <SideNav slot="side-nav">
          <SideNavItem
            text="自动化"
            url={$url("./automations")}
            active={$isActive("./automations")}
          />
          <SideNavItem
            text="备份"
            url={$url("./backups")}
            active={$isActive("./backups")}
          />
          <SideNavItem
            text="嵌入"
            url={$url("./embed")}
            active={$isActive("./embed")}
          />
          <SideNavItem
            text="导出/导入"
            url={$url("./exportImport")}
            active={$isActive("./exportImport")}
          />
          <SideNavItem
            text="名称和URL"
            url={$url("./name-and-url")}
            active={$isActive("./name-and-url")}
          />
          <SideNavItem
            text="版本"
            url={$url("./version")}
            active={$isActive("./version")}
          />
          <div class="delete-action">
            <AbsTooltip
              position={TooltipPosition.Bottom}
              text={$isOnlyUser
                ? null
                : "不可用-其他用户正在编辑此应用"}
            >
              <SideNavItem
                text="删除应用"
                disabled={!$isOnlyUser}
                on:click={() => {
                  deleteModal.show()
                }}
              />
            </AbsTooltip>
          </div>
        </SideNav>
        <slot />
      </Content>
    </Layout>
  </Page>
</div>

<DeleteModal
  bind:this={deleteModal}
  appId={$appStore.appId}
  appName={$appStore.name}
/>

<style>
  .delete-action :global(.text) {
    color: var(--spectrum-global-color-red-400);
  }
  .delete-action {
    display: contents;
  }
  .settings {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    height: 0;
  }
</style>
