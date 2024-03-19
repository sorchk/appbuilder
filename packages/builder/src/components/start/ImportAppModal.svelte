<script>
  import {
    ModalContent,
    Toggle,
    Input,
    Layout,
    Dropzone,
    notifications,
    Body,
  } from "@budibase/bbui"
  import { API } from "api"
  import { initialise } from "stores/builder"

  export let app

  $: disabled = (encrypted && !password) || !file
  let encrypted = false,
    password
  let file

  async function updateApp() {
    try {
      let data = new FormData()
      data.append("appExport", file)
      if (encrypted) {
        data.append("encryptionPassword", password.trim())
      }
      const appId = app.devId
      await API.updateAppFromExport(appId, data)
      const pkg = await API.fetchAppPackage(appId)
      await initialise(pkg)

      notifications.success("App updated successfully")
    } catch (err) {
      notifications.error(`Failed to update app - ${err.message || err}`)
    }
  }
</script>

<ModalContent
  title={`更新 ${app.name}`}
  confirmText="更新"
  onConfirm={updateApp}
  bind:disabled
>
  <Body size="S"
    >使用应用导出更新应用将替换所有表、数据源、，查询、屏幕和自动化。建议执行备份在运行此操作之前。</Body
  >
  <Layout noPadding gap="XS">
    <Dropzone
      gallery={false}
      label="应用导出"
      on:change={e => {
        file = e.detail?.[0]
        encrypted = file?.name?.endsWith(".enc.tar.gz")
      }}
    />
    <Toggle text="加密" bind:value={encrypted} />
    {#if encrypted}
      <Input
        type="password"
        label="密码"
        placeholder="在此处键入..."
        bind:value={password}
      />
    {/if}
  </Layout>
</ModalContent>
