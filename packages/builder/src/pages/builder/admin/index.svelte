<script>
  import {
    Button,
    Heading,
    notifications,
    Layout,
    Body,
    FancyForm,
    FancyInput,
  } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { API } from "api"
  import { admin, auth } from "stores/portal"
  import Logo from "assets/bb-emblem.svg"
  import { TestimonialPage } from "@budibase/frontend-core/src/components"
  import { passwordsMatch, handleError } from "../auth/_components/utils"

  let form
  let errors = {}
  let formData = {}
  let submitted = false

  $: tenantId = $auth.tenantId

  async function save() {
    form.validate()
    if (Object.keys(errors).length > 0) {
      return
    }
    submitted = true
    try {
      let adminUser = { ...formData, tenantId }
      delete adminUser.confirmationPassword
      // Save the admin user
      await API.createAdminUser(adminUser)
      notifications.success("管理员用户已创建")
      await admin.init()
      $goto("../portal")
    } catch (error) {
      submitted = false
      notifications.error(error.message || "Failed to create admin user")
    }
  }
</script>

<TestimonialPage>
  <Layout gap="M" noPadding>
    <Layout justifyItems="center" noPadding>
      <img alt="logo" src={Logo} />
      <Heading size="M">创建超级管理员用户</Heading>
      <Body>管理员用户可以访问所有内容。</Body>
    </Layout>
    <Layout gap="S" noPadding>
      <FancyForm bind:this={form}>
        <FancyInput
          label="电子邮箱"
          value={formData.email}
          on:change={e => {
            formData = {
              ...formData,
              email: e.detail,
            }
          }}
          validate={() => {
            let fieldError = {
              email: !formData.email ? "请输入有效的电子邮件" : undefined,
            }
            errors = handleError({ ...errors, ...fieldError })
          }}
          disabled={submitted}
          error={errors.email}
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
            let fieldError = {}

            fieldError["password"] = !formData.password
              ? "请输入密码"
              : undefined

            fieldError["confirmationPassword"] =
              !passwordsMatch(
                formData.password,
                formData.confirmationPassword
              ) && formData.confirmationPassword
                ? "密码必须匹配"
                : undefined

            errors = handleError({ ...errors, ...fieldError })
          }}
          error={errors.password}
          disabled={submitted}
        />
        <FancyInput
          label="再次输入密码"
          value={formData.confirmationPassword}
          type="password"
          on:change={e => {
            formData = {
              ...formData,
              confirmationPassword: e.detail,
            }
          }}
          validate={() => {
            let fieldError = {
              confirmationPassword:
                !passwordsMatch(
                  formData.password,
                  formData.confirmationPassword
                ) && formData.password
                  ? "密码必须匹配"
                  : undefined,
            }
            errors = handleError({ ...errors, ...fieldError })
          }}
          error={errors.confirmationPassword}
          disabled={submitted}
        />
      </FancyForm>
    </Layout>
    <Layout gap="XS" noPadding justifyItems="center">
      <Button
        cta
        size="L"
        disabled={Object.keys(errors).length > 0 || submitted}
        on:click={save}
      >
      创建超级管理员用户
      </Button>
    </Layout>
  </Layout>
</TestimonialPage>

<style>
  img {
    width: 48px;
  }
</style>
