<script>
  import {
    keepOpen,
    ModalContent,
    Select,
    Input,
    Button,
    notifications,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { API } from "api"
  import ErrorsBox from "components/common/ErrorsBox.svelte"
  import { roles } from "stores/builder"

  const BASE_ROLE = { _id: "", inherits: "BASIC", permissionId: "write" }

  let basePermissions = []
  let selectedRole = BASE_ROLE
  let errors = []
  let builtInRoles = ["Admin", "Power", "Basic", "Public"]
  let validRegex = /^[a-zA-Z0-9_]*$/
  // Don't allow editing of public role
  $: editableRoles = $roles.filter(role => role._id !== "PUBLIC")
  $: selectedRoleId = selectedRole._id
  $: otherRoles = editableRoles.filter(role => role._id !== selectedRoleId)
  $: isCreating = selectedRoleId == null || selectedRoleId === ""

  $: roleNameError = getRoleNameError(selectedRole.name)

  $: valid =
    selectedRole.name &&
    selectedRole.inherits &&
    selectedRole.permissionId &&
    !builtInRoles.includes(selectedRole.name)

  $: shouldDisableRoleInput =
    builtInRoles.includes(selectedRole.name) &&
    selectedRole.name?.toLowerCase() === selectedRoleId?.toLowerCase()

  const fetchBasePermissions = async () => {
    try {
      basePermissions = await API.getBasePermissions()
    } catch (error) {
      notifications.error("获取基本权限选项时出错")
      basePermissions = []
    }
  }

  // Changes the selected role
  const changeRole = event => {
    const id = event?.detail
    const role = $roles.find(role => role._id === id)
    if (role) {
      selectedRole = {
        ...role,
        inherits: role.inherits ?? "",
        permissionId: role.permissionId ?? "",
      }
    } else {
      selectedRole = BASE_ROLE
    }
    errors = []
  }

  // Saves or creates the selected role
  const saveRole = async () => {
    errors = []

    // Clean up empty strings
    const keys = ["_id", "inherits", "permissionId"]
    keys.forEach(key => {
      if (selectedRole[key] === "") {
        delete selectedRole[key]
      }
    })

    // Validation
    if (!selectedRole.name || selectedRole.name.trim() === "") {
      errors.push({ message: "请输入角色名称" })
    }
    if (!selectedRole.permissionId) {
      errors.push({ message: "请选择权限" })
    }
    if (errors.length) {
      return keepOpen
    }

    // Save/create the role
    try {
      await roles.save(selectedRole)
      notifications.success("角色保存成功")
    } catch (error) {
      notifications.error(`保存角色时出错 - ${error.message}`)
      return keepOpen
    }
  }

  // Deletes the selected role
  const deleteRole = async () => {
    try {
      await roles.delete(selectedRole)
      changeRole()
      notifications.success("成功删除角色")
    } catch (error) {
      notifications.error(`删除角色时出错 - ${error.message}`)
      return false
    }
  }

  const getRoleNameError = name => {
    const hasUniqueRoleName = !otherRoles
      ?.map(role => role.name)
      ?.includes(name)
    const invalidRoleName = !validRegex.test(name)
    if (!hasUniqueRoleName) {
      return "选择一个唯一的角色名称。"
    } else if (invalidRoleName) {
      return "请输入仅由字母数字符号和下划线组成的角色名称"
    }
  }

  onMount(fetchBasePermissions)
</script>

<ModalContent
  title="编辑角色"
  confirmText={isCreating ? "创建" : "保存"}
  onConfirm={saveRole}
  disabled={!valid || roleNameError}
>
  {#if errors.length}
    <ErrorsBox {errors} />
  {/if}
  <Select
    thin
    secondary
    label="角色"
    value={selectedRoleId}
    on:change={changeRole}
    options={editableRoles}
    placeholder="Create new role"
    getOptionValue={role => role._id}
    getOptionLabel={role => role.name}
  />
  {#if selectedRole}
    <Input
      label="名称"
      bind:value={selectedRole.name}
      disabled={!!selectedRoleId}
      error={roleNameError}
    />
    <Select
      label="继承角色"
      bind:value={selectedRole.inherits}
      options={selectedRole._id === "BASIC" ? $roles : otherRoles}
      getOptionValue={role => role._id}
      getOptionLabel={role => role.name}
      disabled={shouldDisableRoleInput}
    />
    <Select
      label="基本权限"
      bind:value={selectedRole.permissionId}
      options={basePermissions}
      getOptionValue={x => x._id}
      getOptionLabel={x => x.name}
      disabled={shouldDisableRoleInput}
    />
  {/if}
  <div slot="footer">
    {#if !isCreating && !builtInRoles.includes(selectedRole.name)}
      <Button warning on:click={deleteRole}>删除</Button>
    {/if}
  </div>
</ModalContent>
