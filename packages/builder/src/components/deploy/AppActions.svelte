<script>
  import {
    notifications,
    Popover,
    Layout,
    Body,
    Button,
    ActionButton,
    Icon,
    Link,
    Modal,
    StatusLight,
    AbsTooltip,
  } from "@budibase/bbui"
  import RevertModal from "components/deploy/RevertModal.svelte"
  import VersionModal from "components/deploy/VersionModal.svelte"
  import UpdateAppModal from "components/start/UpdateAppModal.svelte"
  import { processStringSync } from "@budibase/string-templates"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import analytics, { Events, EventSource } from "analytics"
  import { API } from "api"
  import { appsStore } from "stores/portal"
  import {
    previewStore,
    builderStore,
    isOnlyUser,
    appStore,
    deploymentStore,
    initialise,
    sortedScreens,
  } from "stores/builder"
  import TourWrap from "components/portal/onboarding/TourWrap.svelte"
  import { TOUR_STEP_KEYS } from "components/portal/onboarding/tours.js"
  import { goto } from "@roxi/routify"
  import { onMount } from "svelte"
  import PosthogClient from "../../analytics/PosthogClient"

  export let application
  export let loaded

  const posthog = new PosthogClient(process.env.POSTHOG_TOKEN)

  let unpublishModal
  let updateAppModal
  let revertModal
  let versionModal
  let appActionPopover
  let appActionPopoverOpen = false
  let appActionPopoverAnchor
  let publishing = false
  let showNpsSurvey = false
  let lastOpened

  $: filteredApps = $appsStore.apps.filter(app => app.devId === application)
  $: selectedApp = filteredApps?.length ? filteredApps[0] : null
  $: latestDeployments = $deploymentStore
    .filter(deployment => deployment.status === "SUCCESS")
    .sort((a, b) => a.updatedAt > b.updatedAt)
  $: isPublished =
    selectedApp?.status === "published" && latestDeployments?.length > 0
  $: updateAvailable =
    $appStore.upgradableVersion &&
    $appStore.version &&
    $appStore.upgradableVersion !== $appStore.version
  $: canPublish = !publishing && loaded && $sortedScreens.length > 0
  $: lastDeployed = getLastDeployedString($deploymentStore, lastOpened)

  const initialiseApp = async () => {
    const applicationPkg = await API.fetchAppPackage($appStore.devId)
    await initialise(applicationPkg)
  }

  const getLastDeployedString = deployments => {
    return deployments?.length
      ? processStringSync("发布在 {{ duration time 'millisecond' }} 之前", {
          time:
            new Date().getTime() - new Date(deployments[0].updatedAt).getTime(),
        })
      : ""
  }

  const previewApp = () => {
    previewStore.showPreview(true)
  }

  const viewApp = () => {
    analytics.captureEvent(Events.APP_VIEW_PUBLISHED, {
      appId: selectedApp.appId,
      eventSource: EventSource.PORTAL,
    })
    if (selectedApp.url) {
      window.open(`/app${selectedApp.url}`)
    } else {
      window.open(`/${selectedApp.prodId}`)
    }
  }

  async function publishApp() {
    try {
      publishing = true
      await API.publishAppChanges($appStore.appId)
      notifications.send("应用发布成功", {
        type: "success",
        icon: "GlobeCheck",
      })
      showNpsSurvey = true
      await completePublish()
    } catch (error) {
      console.error(error)
      analytics.captureException(error)
      const baseMsg = "发布应用时出错"
      const message = error.message
      if (message) {
        notifications.error(`${baseMsg} - ${message}`)
      } else {
        notifications.error(baseMsg)
      }
    }
    publishing = false
  }

  const unpublishApp = () => {
    appActionPopover.hide()
    unpublishModal.show()
  }

  const revertApp = () => {
    appActionPopover.hide()
    revertModal.show()
  }

  const confirmUnpublishApp = async () => {
    if (!application || !isPublished) {
      //confirm the app has loaded.
      return
    }
    try {
      await API.unpublishApp(selectedApp.prodId)
      await appsStore.load()
      notifications.send("应用程序未发布", {
        type: "success",
        icon: "GlobeStrike",
      })
    } catch (err) {
      notifications.error("取消发布应用程序时出错")
    }
  }

  const completePublish = async () => {
    try {
      await appsStore.load()
      await deploymentStore.load()
    } catch (err) {
      notifications.error("刷新应用程序时出错")
    }
  }

  onMount(() => {
    posthog.init()
  })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="action-top-nav">
  <div class="action-buttons">
    {#if updateAvailable && $isOnlyUser}
      <div class="app-action-button version" on:click={versionModal.show}>
        <div class="app-action">
          <ActionButton quiet>
            <StatusLight notice />
            更新
          </ActionButton>
        </div>
      </div>
    {/if}
    <TourWrap
      stepKeys={[
        TOUR_STEP_KEYS.BUILDER_USER_MANAGEMENT,
        TOUR_STEP_KEYS.FEATURE_USER_MANAGEMENT,
      ]}
    >
      <div class="app-action-button users">
        <div class="app-action" id="builder-app-users-button">
          <ActionButton
            quiet
            icon="UserGroup"
            on:click={() => {
              builderStore.showBuilderSidePanel()
            }}
          >
            用户
          </ActionButton>
        </div>
      </div>
    </TourWrap>

    <div class="app-action-button preview">
      <div class="app-action">
        <ActionButton
          disabled={$sortedScreens.length === 0}
          quiet
          icon="PlayCircle"
          on:click={previewApp}
        >
          预览
        </ActionButton>
      </div>
    </div>

    <div
      class="app-action-button publish app-action-popover"
      on:click={() => {
        if (!appActionPopoverOpen) {
          lastOpened = new Date()
          appActionPopover.show()
        } else {
          appActionPopover.hide()
        }
      }}
    >
      <div bind:this={appActionPopoverAnchor}>
        <div class="app-action">
          <Icon name={isPublished ? "GlobeCheck" : "GlobeStrike"} />
          <TourWrap stepKeys={[TOUR_STEP_KEYS.BUILDER_APP_PUBLISH]}>
            <span class="publish-open" id="builder-app-publish-button">
              发布
              <Icon
                name={appActionPopoverOpen ? "ChevronUp" : "ChevronDown"}
                size="M"
              />
            </span>
          </TourWrap>
        </div>
      </div>
      <Popover
        bind:this={appActionPopover}
        align="right"
        disabled={!isPublished}
        anchor={appActionPopoverAnchor}
        offset={35}
        on:close={() => {
          appActionPopoverOpen = false
        }}
        on:open={() => {
          appActionPopoverOpen = true
        }}
      >
        <div class="app-action-popover-content">
          <Layout noPadding gap="M">
            <Body size="M">
              <span
                class="app-link"
                on:click={() => {
                  appActionPopover.hide()
                  if (isPublished) {
                    viewApp()
                  } else {
                    updateAppModal.show()
                  }
                }}
              >
                {$appStore.url}
                {#if isPublished}
                  <Icon size="S" name="LinkOut" />
                {:else}
                  <Icon size="S" name="Edit" />
                {/if}
              </span>
            </Body>

            <Body size="S">
              <span class="publish-popover-status">
                {#if isPublished}
                  <span class="status-text">
                    {lastDeployed}
                  </span>
                  <span class="unpublish-link">
                    <Link quiet on:click={unpublishApp}>未发布的</Link>
                  </span>
                  <span class="revert-link">
                    <AbsTooltip
                      text={$isOnlyUser
                        ? null
                        : "不可用-其他用户正在编辑此应用"}
                    >
                      <Link
                        disabled={!$isOnlyUser}
                        quiet
                        secondary
                        on:click={revertApp}
                      >
                      还原
                      </Link>
                    </AbsTooltip>
                  </span>
                {:else}
                  <span class="status-text unpublished">Not published</span>
                {/if}
              </span>
            </Body>
            <div class="action-buttons">
              {#if isPublished}
                <ActionButton
                  quiet
                  icon="Code"
                  on:click={() => {
                    $goto("./settings/embed")
                    appActionPopover.hide()
                  }}
                >
                内嵌
                </ActionButton>
              {/if}
              <Button
                cta
                on:click={publishApp}
                id={"builder-app-publish-button"}
                disabled={!canPublish}
              >
                发布
              </Button>
            </div>
          </Layout>
        </div>
      </Popover>
    </div>
  </div>
</div>

<!-- Modals -->
<ConfirmDialog
  bind:this={unpublishModal}
  title="确认取消发布"
  okText="取消发布应用"
  onOk={confirmUnpublishApp}
>是否确实要取消发布应用程序 <b>{selectedApp?.name}</b>?
</ConfirmDialog>

<Modal bind:this={updateAppModal} padding={false} width="600px">
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

<RevertModal bind:this={revertModal} />
<VersionModal hideIcon bind:this={versionModal} />

{#if showNpsSurvey}
  <div class="nps-survey" />
{/if}

<style>
  .app-action-popover-content {
    padding: var(--spacing-xl);
    width: 360px;
  }

  .app-action-popover-content :global(.icon svg.spectrum-Icon) {
    height: 0.8em;
  }

  .action-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
  }

  .action-top-nav {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
  }
  .app-link {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    cursor: pointer;
  }
  .app-action-popover-content .status-text {
    color: var(--spectrum-global-color-green-500);
    border-right: 1px solid var(--spectrum-global-color-gray-500);
    padding-right: var(--spacing-m);
  }
  .app-action-popover-content .status-text.unpublished {
    color: var(--spectrum-global-color-gray-600);
    border-right: 0px;
    padding-right: 0px;
  }
  .app-action-popover-content .action-buttons {
    gap: var(--spacing-m);
  }
  .app-action-popover-content
    .publish-popover-status
    .unpublish-link
    :global(.spectrum-Link) {
    color: var(--spectrum-global-color-red-400);
  }
  .publish-popover-status {
    display: flex;
    gap: var(--spacing-m);
  }
  .app-action-popover .publish-open {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .app-action-button {
    height: 100%;
    display: flex;
    align-items: center;
    padding-right: var(--spacing-m);
  }

  .app-action-button.publish:hover {
    background-color: var(--spectrum-global-color-gray-200);
    cursor: pointer;
  }

  .app-action-button.publish {
    border-left: var(--border-light);
    padding: 0px var(--spacing-l);
  }

  .app-action-button.version :global(.spectrum-ActionButton-label) {
    display: flex;
    gap: var(--spectrum-actionbutton-icon-gap);
  }

  .app-action {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
</style>
