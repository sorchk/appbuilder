<script>
  import {
    keepOpen,
    Label,
    ActionButton,
    ModalContent,
    Multiselect,
    InputDropdown,
    Layout,
    Icon,
  } from "@budibase/bbui"
  import { groups, licensing } from "stores/portal"
  import { Constants } from "@budibase/frontend-core"
  import { emailValidator } from "helpers/validation"
  import { capitalise } from "helpers"

  export let showOnboardingTypeModal

  const password = Math.random().toString(36).substring(2, 22)
  let disabled
  let userGroups = []

  $: userData = [
    {
      email: "",
      role: "appUser",
      password,
      forceResetPassword: true,
    },
  ]
  $: hasError = userData.find(x => x.error != null)
  $: userCount = $licensing.userCount + userData.length
  $: reached = licensing.usersLimitReached(userCount)
  $: exceeded = licensing.usersLimitExceeded(userCount)

  $: internalGroups = $groups?.filter(g => !g?.scimInfo?.isSync)

  function removeInput(idx) {
    userData = userData.filter((e, i) => i !== idx)
  }
  function addNewInput() {
    userData = [
      ...userData,
      {
        email: "",
        role: "appUser",
        password: Math.random().toString(36).substring(2, 22),
        forceResetPassword: true,
        error: null,
      },
    ]
  }

  function validateInput(input, index) {
    if (input.email) {
      input.email = input.email.trim()
    }
    const email = input.email
    if (email) {
      const res = emailValidator(email)
      if (res === true) {
        userData[index].error = null
      } else {
        userData[index].error = res
      }
    } else {
      userData[index].error = "请输入电子邮件地址"
    }
    return userData[index].error == null
  }

  const onConfirm = () => {
    let valid = true
    userData.forEach((input, index) => {
      valid = validateInput(input, index) && valid
    })
    if (!valid) {
      return keepOpen
    }
    showOnboardingTypeModal({ users: userData, groups: userGroups })
  }
</script>

<ModalContent
  {onConfirm}
  size="M"
  title="添加新用户"
  confirmText="添加用户"
  confirmDisabled={disabled}
  cancelText="取消"
  showCloseIcon={false}
  disabled={hasError || !userData.length || exceeded}
>
  <Layout noPadding gap="XS">
    <Label>电子邮箱</Label>
    {#each userData as input, index}
      <div
        style="display: flex;
        align-items: center;
        flex-direction: row;"
      >
        <div style="flex: 1 1 auto;">
          <InputDropdown
            inputType="email"
            bind:inputValue={input.email}
            bind:dropdownValue={input.role}
            options={Constants.BudibaseRoleOptions}
            error={input.error}
            on:blur={() => validateInput(input, index)}
          />
        </div>
        <div class="icon">
          <Icon
            name="Close"
            hoverable
            size="S"
            on:click={() => removeInput(index)}
          />
        </div>
      </div>
    {/each}

    {#if reached}
      <div class="user-notification">
        <Icon name="Info" />
        <span>
          {capitalise($licensing.license.plan.type)} 计划限 {$licensing.userLimit}个用户。升级您的计划以添加更多用户</span
        >
      </div>
    {:else}
      <div>
        <ActionButton on:click={addNewInput} icon="Add">添加电子邮箱</ActionButton>
      </div>
    {/if}
  </Layout>

  {#if $licensing.groupsEnabled && internalGroups?.length}
    <Multiselect
      bind:value={userGroups}
      placeholder="选择组"
      label="组"
      options={internalGroups}
      getOptionLabel={option => option.name}
      getOptionValue={option => option._id}
    />
  {/if}
</ModalContent>

<style>
  .user-notification {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: var(--spacing-m);
  }
  .icon {
    width: 10%;
    align-self: flex-start;
    margin-top: 8px;
  }
</style>
