<script>
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import { writable } from "svelte/store"
  import { auth } from "stores/portal"

  const values = writable({
    firstName: $auth.user.firstName,
    lastName: $auth.user.lastName,
  })

  const updateInfo = async () => {
    try {
      await auth.updateSelf($values)
      notifications.success("信息更新成功")
    } catch (error) {
      console.error(error)
      notifications.error("无法更新信息")
    }
  }
</script>

<ModalContent title="我的配置" confirmText="保存" onConfirm={updateInfo}>
  <Body size="S">
    通过添加您的名字和姓氏对平台进行个性化设置。
  </Body>
  <Input disabled bind:value={$auth.user.email} label="电子邮箱" />
  <Input bind:value={$values.firstName} label="名字" />
  <Input bind:value={$values.lastName} label="姓氏" />
</ModalContent>
