<script>
  import {
    Layout,
    Heading,
    Body,
    Divider,
    File,
    notifications,
    Tags,
    Tag,
    Button,
    Toggle,
    Input,
    Label,
    TextArea,
  } from "@budibase/bbui"
  import { auth, organisation, licensing, admin } from "stores/portal"
  import { API } from "api"
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import { sdk } from "@budibase/shared-core"

  const imageExtensions = [
    ".png",
    ".tiff",
    ".gif",
    ".raw",
    ".jpg",
    ".jpeg",
    ".svg",
    ".bmp",
    ".jfif",
  ]

  const faviconExtensions = [".png", ".ico", ".gif"]

  let mounted = false
  let saving = false

  let logoFile = null
  let logoPreview = null
  let faviconFile = null
  let faviconPreview = null

  let config = {}
  let updated = false

  $: onConfigUpdate(config)
  $: initialised = Object.keys(config).length > 0

  $: isCloud = $admin.cloud
  $: brandingEnabled = $licensing.brandingEnabled

  const onConfigUpdate = () => {
    if (!mounted || updated || !initialised) {
      return
    }
    updated = true
  }

  $: logo = config.logoUrl
    ? { url: config.logoUrl, type: "image", name: "Logo" }
    : null

  $: favicon = config.faviconUrl
    ? { url: config.faviconUrl, type: "image", name: "Favicon" }
    : null

  const previewUrl = async localFile => {
    if (!localFile) {
      return Promise.resolve(null)
    }

    return new Promise(resolve => {
      let reader = new FileReader()
      try {
        reader.onload = e => {
          resolve({
            result: e.target.result,
          })
        }
        reader.readAsDataURL(localFile)
      } catch (error) {
        console.error(error)
        resolve(null)
      }
    })
  }

  $: previewUrl(logoFile).then(response => {
    if (response) {
      logoPreview = response.result
    }
  })

  $: previewUrl(faviconFile).then(response => {
    if (response) {
      faviconPreview = response.result
    }
  })

  async function uploadLogo(file) {
    let response = {}
    try {
      let data = new FormData()
      data.append("file", file)
      response = await API.uploadLogo(data)
    } catch (error) {
      notifications.error("Error uploading logo")
    }
    return response
  }

  async function uploadFavicon(file) {
    let response = {}
    try {
      let data = new FormData()
      data.append("file", file)
      response = await API.uploadFavicon(data)
    } catch (error) {
      notifications.error("Error uploading favicon")
    }
    return response
  }

  async function saveFiles() {
    if (logoFile) {
      const logoResp = await uploadLogo(logoFile)
      if (logoResp.url) {
        logoFile = null
        logoPreview = null
      }
      config.logoUrl = undefined
    }

    if (faviconFile) {
      const faviconResp = await uploadFavicon(faviconFile)
      if (faviconResp.url) {
        faviconFile = null
        faviconPreview = null
      }
      config.faviconUrl = undefined
    }
  }

  function trimFields() {
    const userStrings = [
      "metaTitle",
      "platformTitle",
      "loginButton",
      "loginHeading",
      "metaDescription",
      "metaImageUrl",
    ]

    const trimmed = userStrings.reduce((acc, fieldName) => {
      acc[fieldName] = config[fieldName] ? config[fieldName].trim() : undefined
      return acc
    }, {})

    config = {
      ...config,
      ...trimmed,
    }
  }

  async function saveConfig() {
    saving = true

    await saveFiles()
    trimFields()

    try {
      // Update settings
      await organisation.save(config)
      await init()
      notifications.success("品牌设置已更新")
    } catch (e) {
      console.error("品牌更新失败", e)
      notifications.error("品牌更新失败")
    }
    updated = false
    saving = false
  }

  async function init() {
    if (!$organisation.loaded) {
      await organisation.init()
    }
    config = {
      faviconUrl: $organisation.faviconUrl,
      logoUrl: $organisation.logoUrl,
      platformTitle: $organisation.platformTitle,
      emailBrandingEnabled: $organisation.emailBrandingEnabled,
      loginHeading: $organisation.loginHeading,
      loginButton: $organisation.loginButton,
      testimonialsEnabled: $organisation.testimonialsEnabled,
      metaDescription: $organisation.metaDescription,
      metaImageUrl: $organisation.metaImageUrl,
      metaTitle: $organisation.metaTitle,
    }
  }

  onMount(async () => {
    await init()
    mounted = true
  })
</script>

{#if sdk.users.isAdmin($auth.user) && mounted}
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <div class="title">
        <Heading size="M">品牌</Heading>
        {#if !isCloud && !brandingEnabled}
          <Tags>
            <Tag icon="LockClosed">Premium</Tag>
          </Tags>
        {/if}
        {#if isCloud && !brandingEnabled}
          <Tags>
            <Tag icon="LockClosed">Premium</Tag>
          </Tags>
        {/if}
      </div>
      <Body>删除所有Budibase品牌并使用您自己的品牌。</Body>
    </Layout>
    <Divider />
    <div class="branding fields">
      <div class="field">
        <Label size="L">Logo图</Label>
        <File
          title="上传图片"
          handleFileTooLarge={() => {
            notifications.warn("File too large. 20mb limit")
          }}
          extensions={imageExtensions}
          previewUrl={logoPreview || logo?.url}
          on:change={e => {
            let clone = { ...config }
            if (e.detail) {
              logoFile = e.detail
              logoPreview = null
            } else {
              logoFile = null
              clone.logoUrl = ""
            }
            config = clone
          }}
          value={logoFile || logo}
          disabled={!brandingEnabled || saving}
          allowClear={true}
        />
      </div>

      <div class="field">
        <Label size="L">网站图标</Label>
        <File
          title="上传图标"
          handleFileTooLarge={() => {
            notifications.warn("File too large. 20mb limit")
          }}
          extensions={faviconExtensions}
          previewUrl={faviconPreview || favicon?.url}
          on:change={e => {
            let clone = { ...config }
            if (e.detail) {
              faviconFile = e.detail
              faviconPreview = null
            } else {
              faviconFile = null
              clone.faviconUrl = ""
            }
            config = clone
          }}
          value={faviconFile || favicon}
          disabled={!brandingEnabled || saving}
          allowClear={true}
        />
      </div>
      <div class="field">
        <Label size="L">标题</Label>
        <Input
          on:change={e => {
            let clone = { ...config }
            clone.platformTitle = e.detail ? e.detail : ""
            config = clone
          }}
          value={config.platformTitle || ""}
          disabled={!brandingEnabled || saving}
        />
      </div>
      <div>
        <Toggle
          text={"从电子邮件中删除Budibase品牌"}
          on:change={e => {
            let clone = { ...config }
            clone.emailBrandingEnabled = !e.detail
            config = clone
          }}
          value={!config.emailBrandingEnabled}
          disabled={!brandingEnabled || saving}
        />
      </div>
    </div>

    <Divider />
    <Layout gap="XS" noPadding>
      <Heading size="S">登录</Heading>
      <Body />
    </Layout>
    <div class="login">
      <div class="fields">
        <div class="field">
          <Label size="L">登录头</Label>
          <Input
            on:change={e => {
              let clone = { ...config }
              clone.loginHeading = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.loginHeading || ""}
            disabled={!brandingEnabled || saving}
          />
        </div>

        <div class="field">
          <Label size="L">按钮</Label>
          <Input
            on:change={e => {
              let clone = { ...config }
              clone.loginButton = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.loginButton || ""}
            disabled={!brandingEnabled || saving}
          />
        </div>
        <div>
          <Toggle
            text={"删除客户推荐"}
            on:change={e => {
              let clone = { ...config }
              clone.testimonialsEnabled = !e.detail
              config = clone
            }}
            value={!config.testimonialsEnabled}
            disabled={!brandingEnabled || saving}
          />
        </div>
      </div>
    </div>
    <Divider />
    <Layout gap="XS" noPadding>
      <Heading size="S">应用程序预览</Heading>
      <Body>在应用程序预览中自定义元标签</Body>
    </Layout>
    <div class="app-previews">
      <div class="fields">
        <div class="field">
          <Label size="L">图片网址</Label>
          <Input
            on:change={e => {
              let clone = { ...config }
              clone.metaImageUrl = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.metaImageUrl}
            disabled={!brandingEnabled || saving}
          />
        </div>
        <div class="field">
          <Label size="L">标题</Label>
          <Input
            on:change={e => {
              let clone = { ...config }
              clone.metaTitle = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.metaTitle}
            disabled={!brandingEnabled || saving}
          />
        </div>
        <div class="field">
          <Label size="L">描述</Label>
          <TextArea
            on:change={e => {
              let clone = { ...config }
              clone.metaDescription = e.detail ? e.detail : ""
              config = clone
            }}
            value={config.metaDescription}
            disabled={!brandingEnabled || saving}
          />
        </div>
      </div>
    </div>
    <div class="buttons">
      {#if !brandingEnabled}
        <Button
          on:click={() => {
            if (isCloud && $auth?.user?.accountPortalAccess) {
              window.open($admin.accountPortalUrl + "/portal/upgrade", "_blank")
            } else if (sdk.users.isAdmin($auth.user)) {
              $goto("/builder/portal/account/upgrade")
            }
          }}
          secondary
          disabled={saving}
        >
        升级
        </Button>
      {/if}
      <Button
        on:click={saveConfig}
        cta
        disabled={saving || !updated || !$organisation.loaded}
      >
        保存
      </Button>
    </div>
  </Layout>
{/if}

<style>
  .buttons {
    display: flex;
    gap: var(--spacing-m);
  }
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing-m);
  }

  .branding,
  .login {
    width: 70%;
    max-width: 70%;
  }
  .fields {
    display: grid;
    grid-gap: var(--spacing-m);
  }
  .field {
    display: grid;
    grid-template-columns: 80px auto;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>
