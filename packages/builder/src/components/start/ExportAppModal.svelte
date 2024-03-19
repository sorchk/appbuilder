<script>
  import {
    ModalContent,
    keepOpen,
    Toggle,
    Body,
    InlineAlert,
    Input,
    notifications,
  } from "@budibase/bbui"
  import { createValidationStore } from "helpers/validation/yup"

  export let app
  export let published
  let includeInternalTablesRows = true
  let encrypt = true

  let password = null
  const validation = createValidationStore()
  validation.addValidatorType("password", "password", true, { minLength: 8 })
  $: validation.observe("password", password)

  const Step = { CONFIG: "config", SET_PASSWORD: "set_password" }
  let currentStep = Step.CONFIG

  $: exportButtonText = published ? "Export published" : "Export latest"
  $: stepConfig = {
    [Step.CONFIG]: {
      title: published ? "Export published app" : "Export latest app",
      confirmText: encrypt ? "Continue" : exportButtonText,
      onConfirm: () => {
        if (!encrypt) {
          exportApp()
        } else {
          currentStep = Step.SET_PASSWORD
          return keepOpen
        }
      },
      isValid: true,
    },
    [Step.SET_PASSWORD]: {
      title: "添加密码以加密导出",
      confirmText: exportButtonText,
      onConfirm: async () => {
        await validation.check({ password })
        if (!$validation.valid) {
          return keepOpen
        }
        await exportApp(password)
      },
      isValid: $validation.valid,
    },
  }

  const exportApp = async () => {
    const id = published ? app.prodId : app.devId
    const url = `/api/backups/export?appId=${id}`
    await downloadFile(url, {
      excludeRows: !includeInternalTablesRows,
      encryptPassword: password,
    })
  }

  async function downloadFile(url, body) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const contentDisposition = response.headers.get("Content-Disposition")

        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
          contentDisposition
        )

        const filename = matches[1].replace(/['"]/g, "")

        const url = URL.createObjectURL(await response.blob())

        const link = document.createElement("a")
        link.href = url
        link.download = filename
        link.click()

        URL.revokeObjectURL(url)
      } else {
        notifications.error("Error exporting the app.")
      }
    } catch (error) {
      notifications.error(error.message || "Error downloading the exported app")
    }
  }
</script>

<ModalContent
  title={stepConfig[currentStep].title}
  confirmText={stepConfig[currentStep].confirmText}
  onConfirm={stepConfig[currentStep].onConfirm}
  disabled={!stepConfig[currentStep].isValid}
>
  {#if currentStep === Step.CONFIG}
    <Body>
      <Toggle
        text="从内部表导出行"
        bind:value={includeInternalTablesRows}
      />
      <Toggle text="加密我的导出" bind:value={encrypt} />
    </Body>
    <InlineAlert
      header={encrypt
        ? "请注意，在导出过程中不会加密附件，以确保高效导出大型附件。"
        : "不要公开共享您的应用程序导出，因为它们可能包含数据库凭据或密钥等敏感信息。"}
    />
  {/if}
  {#if currentStep === Step.SET_PASSWORD}
    <Input
      type="password"
      label="密码"
      autocomplete="new-password"
      placeholder="在此处键入..."
      bind:value={password}
      error={$validation.errors.password}
    />
  {/if}
</ModalContent>
