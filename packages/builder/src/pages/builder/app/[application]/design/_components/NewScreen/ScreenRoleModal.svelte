<script>
  import { Select, ModalContent } from "@budibase/bbui"
  import { RoleUtils } from "@budibase/frontend-core"
  import { roles, screenStore } from "stores/builder"
  import { get } from "svelte/store"
  import { onMount } from "svelte"

  export let onConfirm
  export let onCancel
  export let screenUrl
  export let screenAccessRole
  export let confirmText = "完成"

  let error

  const onChangeRole = e => {
    const roleId = e.detail
    if (routeExists(screenUrl, roleId)) {
      error = "此URL已用于此访问角色"
    } else {
      error = null
    }
  }

  const routeExists = (url, role) => {
    if (!url || !role) {
      return false
    }
    return get(screenStore).screens.some(
      screen =>
        screen.routing.route.toLowerCase() === url.toLowerCase() &&
        screen.routing.roleId === role
    )
  }

  onMount(() => {
    // Validate the initial role
    onChangeRole({ detail: screenAccessRole })
  })
</script>

<ModalContent
  title="Access"
  {confirmText}
  cancelText="返回"
  {onConfirm}
  {onCancel}
  disabled={!!error}
>
选择查看这些屏幕所需的访问级别
  <Select
    bind:value={screenAccessRole}
    on:change={onChangeRole}
    label="访问角色"
    {error}
    getOptionLabel={role => role.name}
    getOptionValue={role => role._id}
    getOptionColour={role => RoleUtils.getRoleColour(role._id)}
    options={$roles}
    placeholder={null}
  />
</ModalContent>
