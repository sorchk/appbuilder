<script>
  import {
    ModalContent,
    keepOpen,
    Body,
    notifications,
    CopyInput,
  } from "@budibase/bbui"
  import { auth } from "stores/portal"
  import { onMount } from "svelte"

  let apiKey = null

  async function generateAPIKey() {
    try {
      apiKey = await auth.generateAPIKey()
      notifications.success("生成了新的API密钥")
    } catch (err) {
      notifications.error("无法生成新的API密钥")
    }

    return keepOpen
  }

  onMount(async () => {
    try {
      apiKey = await auth.fetchAPIKey()
    } catch (err) {
      notifications.error("无法获取API密钥")
    }
  })
</script>

<ModalContent
  title="API密钥"
  showSecondaryButton
  secondaryButtonText="重新生成密钥"
  secondaryAction={generateAPIKey}
  showCancelButton={false}
  confirmText="关闭"
>
  <Body size="S">用于访问公共API的API密钥：</Body>
  <CopyInput bind:value={apiKey} />
</ModalContent>
