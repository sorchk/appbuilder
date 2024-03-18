<script>
  import { auth } from "stores/portal"
  import { ActionMenu, MenuItem, Icon, Modal } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import ProfileModal from "components/settings/ProfileModal.svelte"
  import ChangePasswordModal from "components/settings/ChangePasswordModal.svelte"
  import ThemeModal from "components/settings/ThemeModal.svelte"
  import APIKeyModal from "components/settings/APIKeyModal.svelte"
  import { UserAvatar } from "@budibase/frontend-core"

  let themeModal
  let profileModal
  let updatePasswordModal
  let apiKeyModal

  const logout = async () => {
    try {
      await auth.logout()
    } catch (error) {
      // Swallow error and do nothing
    }
  }
</script>

<ActionMenu align="right">
  <div slot="control" class="user-dropdown">
    <UserAvatar user={$auth.user} showTooltip={false} />
    <Icon size="XL" name="ChevronDown" />
  </div>
  <MenuItem icon="UserEdit" on:click={() => profileModal.show()}>
    个人信息
  </MenuItem>
  <MenuItem icon="Moon" on:click={() => themeModal.show()}>主题</MenuItem>
  {#if !$auth.isSSO}
    <MenuItem icon="LockClosed" on:click={() => updatePasswordModal.show()}>
      修改密码
    </MenuItem>
  {/if}
  <MenuItem icon="Key" on:click={() => apiKeyModal.show()}>
    查看API key
  </MenuItem>
  <MenuItem icon="UserDeveloper" on:click={() => $goto("../apps")}>
    关闭开发者模式
  </MenuItem>
  <MenuItem icon="LogOut" on:click={logout}>退出登录</MenuItem>
</ActionMenu>

<Modal bind:this={themeModal}>
  <ThemeModal />
</Modal>
<Modal bind:this={profileModal}>
  <ProfileModal />
</Modal>
<Modal bind:this={updatePasswordModal}>
  <ChangePasswordModal />
</Modal>
<Modal bind:this={apiKeyModal}>
  <APIKeyModal />
</Modal>

<style>
  .user-dropdown {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-s);
  }
  .user-dropdown:hover {
    cursor: pointer;
    filter: brightness(110%);
  }
</style>
