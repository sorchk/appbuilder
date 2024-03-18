<script>
  import { ModalContent, Body, notifications } from "@budibase/bbui"
  import PasswordRepeatInput from "components/common/users/PasswordRepeatInput.svelte"
  import { auth } from "stores/portal"

  let password
  let error

  const updatePassword = async () => {
    try {
      await auth.updateSelf({ password })
      notifications.success("Password changed successfully")
    } catch (error) {
      notifications.error("Failed to update password")
    }
  }
</script>

<ModalContent
  title="更新密码"
  confirmText="更新密码"
  onConfirm={updatePassword}
  disabled={error || !password}
>
  <Body size="S">Enter your new password below.</Body>
  <PasswordRepeatInput bind:password bind:error />
</ModalContent>
