<script>
  import {
    Layout,
    Heading,
    Body,
    Button,
    Divider,
    Label,
    Input,
    notifications,
    Toggle,
  } from "@budibase/bbui"
  import { auth, organisation, admin } from "stores/portal"
  import { writable } from "svelte/store"
  import { redirect } from "@roxi/routify"
  import { sdk } from "@budibase/shared-core"

  // Only admins allowed here
  $: {
    if (!sdk.users.isAdmin($auth.user)) {
      $redirect("../../portal")
    }
  }

  const values = writable({
    isSSOEnforced: $organisation.isSSOEnforced,
    company: $organisation.company,
    platformUrl: $organisation.platformUrl,
    analyticsEnabled: $organisation.analyticsEnabled,
  })

  let loading = false

  async function saveConfig() {
    loading = true

    try {
      const config = {
        isSSOEnforced: $values.isSSOEnforced,
        company: $values.company ?? "",
        platformUrl: $values.platformUrl ?? "",
        analyticsEnabled: $values.analyticsEnabled,
      }

      // Update settings
      await organisation.save(config)
    } catch (error) {
      notifications.error("保存组织配置时出错")
    }
    loading = false
  }
</script>

{#if sdk.users.isAdmin($auth.user)}
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <Heading size="M">组织</Heading>
      <Body>编辑和管理您的所有组织设置</Body>
    </Layout>
    <Divider />
    <div class="fields">
      <div class="field">
        <Label size="L">组织名</Label>
        <Input thin bind:value={$values.company} />
      </div>

      {#if !$admin.cloud}
        <div class="field">
          <Label
            size="L"
            tooltip={"更新平台URL以匹配您的 web URL。这将使电子邮件模板和身份验证配置保持最新"}
          >
          平台 URL
          </Label>
          <Input thin bind:value={$values.platformUrl} />
        </div>
      {/if}
      {#if !$admin.cloud}
        <div class="field">
          <Label size="L">分析</Label>
          <Toggle text="" bind:value={$values.analyticsEnabled} />
        </div>
      {/if}
    </div>
    <div>
      <Button disabled={loading} on:click={saveConfig} cta>保存</Button>
    </div>
  </Layout>
{/if}

<style>
  .fields {
    display: grid;
    grid-gap: var(--spacing-m);
  }
  .field {
    display: grid;
    grid-template-columns: 120px 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>
