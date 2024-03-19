<script>
  import {
    notifications,
    Button,
    Layout,
    Body,
    Heading,
    Icon,
    FancyForm,
    FancyInput,
  } from "@budibase/bbui"
  import { organisation, auth } from "stores/portal"
  import Logo from "assets/bb-emblem.svg"
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import { TestimonialPage } from "@budibase/frontend-core/src/components"

  let email = ""
  let form
  let error
  let submitted = false

  async function forgot() {
    form.validate()
    if (error) {
      return
    }
    submitted = true
    try {
      await auth.forgotPassword(email)
      notifications.success("电子邮件已发送-请检查您的收件箱")
    } catch (err) {
      submitted = false
      notifications.error("无法发送重置密码链接")
    }
  }

  onMount(async () => {
    try {
      await organisation.init()
    } catch (error) {
      notifications.error("获取组织配置时出错")
    }
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<TestimonialPage enabled={$organisation.testimonialsEnabled}>
  <Layout gap="S" noPadding>
    <img alt="logo" src={$organisation.logoUrl || Logo} />
    <span class="heading-wrap">
      <Heading size="M">
        <div class="heading-content">
          <span class="back-chev" on:click={() => $goto("../")}>
            <Icon name="ChevronLeft" size="XL" />
          </span>
          忘记密码?
        </div>
      </Heading>
    </span>
    <Layout gap="XS" noPadding>
      <Body size="M">
        没问题！只需输入您帐户的电子邮件地址，我们就会向您发送链接以重置它。
      </Body>
    </Layout>

    <Layout gap="S" noPadding>
      <FancyForm bind:this={form}>
        <FancyInput
          label="电子邮箱"
          value={email}
          on:change={e => {
            email = e.detail
          }}
          validate={() => {
            if (!email) {
              return "请输入您的电子邮箱"
            }
            return null
          }}
          {error}
          disabled={submitted}
        />
      </FancyForm>
    </Layout>
    <div>
      <Button
        size="L"
        disabled={!email || error || submitted}
        cta
        on:click={forgot}
      >
        重置密码
      </Button>
    </div>
  </Layout>
</TestimonialPage>

<style>
  img {
    width: 46px;
  }
  .back-chev {
    display: inline-block;
    cursor: pointer;
    margin-left: -5px;
  }
  .heading-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }
</style>
