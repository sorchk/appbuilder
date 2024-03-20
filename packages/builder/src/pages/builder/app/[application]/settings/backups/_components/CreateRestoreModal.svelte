<script>
  import { ModalContent, Input, Body } from "@budibase/bbui"
  import { auth } from "stores/portal"

  export let confirm

  let templateName = $auth.user.firstName
    ? `${$auth.user.firstName}的备份`
    : "还原备份"
  let name = templateName
</script>

<ModalContent
  onConfirm={() => confirm(name)}
  title="备份当前版本"
  confirmText="确认还原"
  disabled={!name}
>
  <Body size="S"
    >创建当前应用程序的备份，允许您在之后回滚还原此备份</Body
  >
  <Input label="备份名" bind:value={name} />
</ModalContent>

<style>
</style>
