<script>
  import {
    ActionMenu,
    Heading,
    Icon,
    Layout,
    MenuItem,
    Modal,
    Table,
    notifications,
  } from "@budibase/bbui"
  import { goto, url } from "@roxi/routify"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { Breadcrumb, Breadcrumbs } from "components/portal/page"
  import { roles } from "stores/builder"
  import { appsStore, auth, groups } from "stores/portal"
  import { onMount, setContext } from "svelte"
  import AppNameTableRenderer from "../users/_components/AppNameTableRenderer.svelte"
  import AppRoleTableRenderer from "../users/_components/AppRoleTableRenderer.svelte"
  import CreateEditGroupModal from "./_components/CreateEditGroupModal.svelte"
  import GroupIcon from "./_components/GroupIcon.svelte"
  import GroupUsers from "./_components/GroupUsers.svelte"
  import { sdk } from "@budibase/shared-core"
  import { Constants } from "@budibase/frontend-core"

  export let groupId

  const appSchema = {
    name: {
      width: "2fr",
    },
    role: {
      width: "1fr",
    },
  }
  const customAppTableRenderers = [
    {
      column: "name",
      component: AppNameTableRenderer,
    },
    {
      column: "role",
      component: AppRoleTableRenderer,
    },
  ]

  let loaded = false
  let editModal, deleteModal

  $: group = $groups.find(x => x._id === groupId)
  $: isScimGroup = group?.scimInfo?.isSync
  $: isAdmin = sdk.users.isAdmin($auth.user)
  $: readonly = !isAdmin || isScimGroup
  $: groupApps = $appsStore.apps
    .filter(app =>
      groups.actions
        .getGroupAppIds(group)
        .includes(appsStore.getProdAppID(app.devId))
    )
    .map(app => ({
      ...app,
      role: group?.builder?.apps.includes(appsStore.getProdAppID(app.devId))
        ? Constants.Roles.CREATOR
        : group?.roles?.[appsStore.getProdAppID(app.devId)],
    }))

  $: {
    if (loaded && !group?._id) {
      $goto("./")
    }
  }

  async function deleteGroup() {
    try {
      await groups.actions.delete(group)
      notifications.success("成功删除用户组")
      $goto("./")
    } catch (error) {
      notifications.error(`删除用户组失败`)
    }
  }

  async function saveGroup(group) {
    try {
      await groups.actions.save(group)
    } catch (error) {
      if (error.message) {
        notifications.error(error.message)
      } else {
        notifications.error(`保存用户组失败`)
      }
    }
  }

  const removeApp = async app => {
    await groups.actions.removeApp(groupId, appsStore.getProdAppID(app.devId))
  }
  setContext("roles", {
    updateRole: () => {},
    removeRole: removeApp,
  })

  onMount(async () => {
    try {
      await Promise.all([groups.actions.init(), roles.fetch()])
      loaded = true
    } catch (error) {
      notifications.error("获取用户组数据时出错")
    }
  })
</script>

{#if loaded}
  <Layout noPadding gap="L">
    <Breadcrumbs>
      <Breadcrumb url={$url("./")} text="组" />
      <Breadcrumb text={group?.name} />
    </Breadcrumbs>

    <div class="header">
      <GroupIcon {group} size="L" />
      <Heading>{group?.name}</Heading>
      <ActionMenu align="right">
        <span slot="control">
          <Icon hoverable name="More" />
        </span>
        <MenuItem
          icon="Refresh"
          on:click={() => editModal.show()}
          disabled={!isAdmin}
        >
          编辑
        </MenuItem>
        <div title={isScimGroup && "从您的AD同步的组"}>
          <MenuItem
            icon="Delete"
            on:click={() => deleteModal.show()}
            disabled={readonly}
          >
            删除
          </MenuItem>
        </div>
      </ActionMenu>
    </div>

    <Layout noPadding gap="S">
      <GroupUsers {groupId} {readonly} {isScimGroup} />
    </Layout>

    <Layout noPadding gap="S">
      <Heading size="S">应用</Heading>
      <Table
        schema={appSchema}
        data={groupApps}
        customPlaceholder
        allowEditRows={false}
        customRenderers={customAppTableRenderers}
        on:click={e => $goto(`/builder/app/${e.detail.devId}`)}
      >
        <div class="placeholder" slot="placeholder">
          <Heading size="S">此组无权访问任何应用程序</Heading>
        </div>
      </Table>
    </Layout>
  </Layout>
{/if}

<Modal bind:this={editModal}>
  <CreateEditGroupModal {group} {saveGroup} />
</Modal>

<ConfirmDialog
  bind:this={deleteModal}
  title="删除用户组"
  okText="删除用户组"
  onOk={deleteGroup}
>
你确定要删除吗 <b>{group?.name}?</b>
</ConfirmDialog>

<style>
  .header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-l);
  }
  .header :global(.spectrum-Heading) {
    flex: 1 1 auto;
  }
  .placeholder {
    width: 100%;
    text-align: center;
  }
</style>
