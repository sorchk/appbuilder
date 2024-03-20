<script>
  import { createEventDispatcher } from "svelte"
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import { users } from "stores/portal"

  const dispatch = createEventDispatcher()

  export let user

  const password = Math.random().toString(36).slice(2, 20)

  async function resetPassword() {
    try {
      await users.save({
        ...user,
        password,
        forceResetPassword: true,
      })
      notifications.success("密码重置成功")
      dispatch("update")
    } catch (error) {
      notifications.error("重置密码时出错")
    }
  }
</script>

<ModalContent
  onConfirm={resetPassword}
  size="M"
  title="强制重置用户密码"
  confirmText="重置密码"
  cancelText="取消"
  showCloseIcon={false}
>
  <Body noPadding
    >在重置用户密码之前，不要忘记复制新密码暗语用户需要此项才能登录。一旦用户登录，他们将被要求创建一个更安全的新密码。</Body
  >
  <Input disabled label="Password" value={password} />
</ModalContent>
