<script>
  import { onMount } from "svelte"
  import {
    ModalContent,
    Layout,
    Select,
    Body,
    Input,
    EnvDropdown,
    Modal,
    notifications,
  } from "@budibase/bbui"
  import { AUTH_TYPE_LABELS, AUTH_TYPES } from "./authTypes"
  import BindableCombobox from "components/common/bindings/BindableCombobox.svelte"
  import { getAuthBindings, getEnvironmentBindings } from "dataBinding"
  import { environment, licensing, auth } from "stores/portal"
  import CreateEditVariableModal from "components/portal/environment/CreateEditVariableModal.svelte"

  export let configs
  export let currentConfig
  export let onConfirm
  export let onRemove

  let form = {
    basic: {},
    bearer: {},
  }

  let errors = {
    basic: {},
    bearer: {},
  }

  let blurred = {
    basic: {},
    bearer: {},
  }

  let hasErrors = false
  let hasChanged = false

  let createVariableModal
  let formFieldkey

  onMount(async () => {
    try {
      await environment.loadVariables()
      if ($auth.user) {
        await licensing.init()
      }
    } catch (err) {
      console.error(err)
    }

    if (currentConfig) {
      deconstructConfig()
    }
  })

  /**
   * map the current config's data into the form by type
   */
  const deconstructConfig = () => {
    form.name = currentConfig.name
    form.type = currentConfig.type

    if (currentConfig.type === AUTH_TYPES.BASIC) {
      form.basic = {
        ...currentConfig.config,
      }
    } else if (currentConfig.type === AUTH_TYPES.BEARER) {
      form.bearer = {
        ...currentConfig.config,
      }
    }
  }

  /**
   * map the form into a new config to save by type
   */
  const constructConfig = () => {
    const newConfig = {
      name: form.name,
      type: form.type,
    }

    if (currentConfig) {
      newConfig._id = currentConfig._id
    }

    if (form.type === AUTH_TYPES.BASIC) {
      newConfig.config = {
        ...form.basic,
      }
    } else if (form.type === AUTH_TYPES.BEARER) {
      newConfig.config = {
        ...form.bearer,
      }
    }

    return newConfig
  }

  /**
   * compare the existing config with the new config to see if there are any changes
   */
  const checkChanged = () => {
    if (currentConfig) {
      hasChanged =
        JSON.stringify(currentConfig) !== JSON.stringify(constructConfig())
    } else {
      hasChanged = true
    }
  }

  const checkErrors = () => {
    hasErrors = false

    // NAME
    const nameError = () => {
      // Unique name
      if (form.name) {
        errors.name =
          // check for duplicate excluding the current config
          configs.find(
            c => c.name === form.name && c.name !== currentConfig?.name
          ) !== undefined
            ? "名称必须唯一"
            : null
      }
      // Name required
      else {
        errors.name = "名称是必填项"
      }
      return !!errors.name
    }

    // TYPE
    const typeError = () => {
      errors.type = form.type ? null : "类型是必需的"
      return !!errors.type
    }

    // BASIC AUTH
    const basicAuthErrors = () => {
      errors.basic.username = form.basic.username
        ? null
        : "用户名是必需的"
      errors.basic.password = form.basic.password
        ? null
        : "密码是必需的"

      return !!(errors.basic.username || errors.basic.password || commonError)
    }

    // BEARER TOKEN
    const bearerTokenErrors = () => {
      errors.bearer.token = form.bearer.token ? null : "需要令牌"
      return !!(errors.bearer.token || commonError)
    }

    const commonError = nameError() || typeError()
    if (form.type === AUTH_TYPES.BASIC) {
      hasErrors = basicAuthErrors() || commonError
    } else if (form.type === AUTH_TYPES.BEARER) {
      hasErrors = bearerTokenErrors() || commonError
    } else {
      hasErrors = !!commonError
    }
  }

  const save = async data => {
    try {
      await environment.createVariable(data)
      form.basic[formFieldkey] = `{{ env.${data.name} }}`
      createVariableModal.hide()
    } catch (err) {
      notifications.error(`未能创建变量： ${err.message}`)
    }
  }

  const onFieldChange = () => {
    checkErrors()
    checkChanged()
  }

  const onConfirmInternal = () => {
    onConfirm(constructConfig())
  }

  async function handleUpgradePanel() {
    await environment.upgradePanelOpened()
    $licensing.goToUpgradePage()
  }

  function showModal(key) {
    formFieldkey = key
    createVariableModal.show()
  }
</script>

<ModalContent
  title={currentConfig ? "更新身份验证" : "添加身份验证"}
  onConfirm={onConfirmInternal}
  confirmText={currentConfig ? "更新" : "添加"}
  disabled={hasErrors || !hasChanged}
  cancelText={"取消"}
  size="M"
  showSecondaryButton={!!currentConfig}
  secondaryButtonText={"删除"}
  secondaryAction={onRemove}
  secondaryButtonWarning={true}
>
  <Layout gap="S">
    <Body size="S">
      当您发送请求时，将自动生成授权标头。
    </Body>
    <Input
      label="名称"
      bind:value={form.name}
      on:change={onFieldChange}
      on:blur={() => (blurred.name = true)}
      error={blurred.name ? errors.name : null}
    />
    <Select
      label="类型"
      bind:value={form.type}
      on:change={onFieldChange}
      options={AUTH_TYPE_LABELS}
      on:blur={() => (blurred.type = true)}
      error={blurred.type ? errors.type : null}
    />
    {#if form.type === AUTH_TYPES.BASIC}
      <EnvDropdown
        label="用户名"
        bind:value={form.basic.username}
        on:change={onFieldChange}
        on:blur={() => (blurred.basic.username = true)}
        error={blurred.basic.username ? errors.basic.username : null}
        showModal={() => showModal("configKey")}
        variables={$environment.variables}
        environmentVariablesEnabled={$licensing.environmentVariablesEnabled}
        {handleUpgradePanel}
      />
      <EnvDropdown
        label="密码"
        type="password"
        bind:value={form.basic.password}
        on:change={onFieldChange}
        on:blur={() => (blurred.basic.password = true)}
        error={blurred.basic.password ? errors.basic.password : null}
        showModal={() => showModal("configKey")}
        variables={$environment.variables}
        environmentVariablesEnabled={$licensing.environmentVariablesEnabled}
        {handleUpgradePanel}
      />
    {/if}
    {#if form.type === AUTH_TYPES.BEARER}
      <BindableCombobox
        label="令牌"
        value={form.bearer.token}
        bindings={[
          ...getAuthBindings(),
          ...($licensing.environmentVariablesEnabled
            ? getEnvironmentBindings()
            : []),
        ]}
        on:change={e => {
          form.bearer.token = e.detail
          onFieldChange()
        }}
        on:blur={() => {
          blurred.bearer.token = true
          onFieldChange()
        }}
        allowJS={false}
        placeholder="Token"
        appendBindingsAsOptions={true}
        drawerEnabled={false}
        error={blurred.bearer.token ? errors.bearer.token : null}
      />
    {/if}
  </Layout>
</ModalContent>

<Modal bind:this={createVariableModal}>
  <CreateEditVariableModal {save} />
</Modal>
