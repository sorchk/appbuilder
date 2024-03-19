<script>
  import {
    ActionButton,
    Body,
    Button,
    Divider,
    Heading,
    Layout,
    notifications,
    Link,
    FancyForm,
    FancyInput,
  } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { auth, organisation, oidc, admin } from "stores/portal"
  import GoogleButton from "./_components/GoogleButton.svelte"
  import OIDCButton from "./_components/OIDCButton.svelte"
  import { handleError } from "./_components/utils"
  import Logo from "assets/bb-emblem.svg"
  import { TestimonialPage } from "@budibase/frontend-core/src/components"
  import { onMount } from "svelte"

  let loaded = false
  let form
  let errors = {}
  let formData = {}

  $: company = $organisation.company || ""
  $: cloud = $admin.cloud

  async function login() {
    form.validate()
    if (Object.keys(errors).length > 0) {
      console.error("errors", errors)
      return
    }
    try {
      await auth.login({
        username: formData?.username.trim(),
        password: formData?.password,
      })
      if ($auth?.user?.forceResetPassword) {
        $goto("./reset")
      } else {
        notifications.success("登录成功")
        $goto("../portal")
      }
    } catch (err) {
      notifications.error(err.message ? err.message : "无效凭据")
    }
  }

  function handleKeydown(evt) {
    if (evt.key === "Enter") login()
  }

  onMount(async () => {
    try {
      await organisation.init()
    } catch (error) {
      notifications.error("获取组织配置时出错")
    }
    loaded = true
  })
</script>

<svelte:window on:keydown={handleKeydown} />
{#if loaded}
  <TestimonialPage enabled={$organisation.testimonialsEnabled}>
    <Layout gap="L" noPadding>
      <Layout justifyItems="center" noPadding>
        {#if loaded}
          <img alt="logo" src={$organisation.logoUrl || Logo} />
        {/if}
        <Heading size="M">
          {$organisation.loginHeading || "登录"}
        </Heading>
      </Layout>
      <Layout gap="S" noPadding>
        {#if loaded && ($organisation.google || $organisation.oidc)}
          <FancyForm>
            <OIDCButton oidcIcon={$oidc.logo} oidcName={$oidc.name} samePage />
            <GoogleButton samePage />
          </FancyForm>
        {/if}
        {#if !$organisation.isSSOEnforced}
          <Divider />
          <FancyForm bind:this={form}>
            <FancyInput
              label="电子邮箱"
              value={formData.username}
              on:change={e => {
                formData = {
                  ...formData,
                  username: e.detail,
                }
              }}
              validate={() => {
                let fieldError = {
                  username: !formData.username
                    ? "请输入有效的电子邮箱"
                    : undefined,
                }
                errors = handleError({ ...errors, ...fieldError })
              }}
              error={errors.username}
            />
            <FancyInput
              label="密码"
              value={formData.password}
              type="password"
              on:change={e => {
                formData = {
                  ...formData,
                  password: e.detail,
                }
              }}
              validate={() => {
                let fieldError = {
                  password: !formData.password
                    ? "请输入您的密码"
                    : undefined,
                }
                errors = handleError({ ...errors, ...fieldError })
              }}
              error={errors.password}
            />
          </FancyForm>
        {/if}
      </Layout>
      {#if !$organisation.isSSOEnforced}
        <Layout gap="XS" noPadding justifyItems="center">
          <Button
            size="L"
            cta
            disabled={Object.keys(errors).length > 0}
            on:click={login}
          >
            {$organisation.loginButton || `登录`}
          </Button>
        </Layout>
        <Layout gap="XS" noPadding justifyItems="center">
          <div class="user-actions">
            <ActionButton size="L" quiet on:click={() => $goto("./forgot")}>
              忘记密码?
            </ActionButton>
          </div>
        </Layout>
      {/if}

      {#if cloud}
        <Body size="xs" textAlign="center">
          使用云
          <br />
          你同意我们的
          <Link
            href="https://budibase.com/eula"
            target="_blank"
            secondary={true}
          >
          许可协议
          </Link>
        </Body>
      {/if}
    </Layout>
  </TestimonialPage>
{/if}

<style>
  .user-actions {
    display: flex;
    align-items: center;
  }
  img {
    width: 48px;
  }
</style>
