<script>
  import { goto } from "@roxi/routify"
  import { Body, ModalContent, notifications } from "@budibase/bbui"

  import { users } from "stores/portal"

  export let user

  async function deleteUser() {
    try {
      await users.delete(user._id)
      notifications.success(`User ${user?.email} deleted.`)
      $goto("./")
    } catch (error) {
      notifications.error("Error deleting user")
    }
  }
</script>

<ModalContent
  warning
  onConfirm={deleteUser}
  title="删除用户"
  confirmText="删除用户"
  cancelText="取消"
  showCloseIcon={false}
>
  <Body>
    你确定要删除吗 <strong>{user?.email}</strong>
  </Body>
</ModalContent>
