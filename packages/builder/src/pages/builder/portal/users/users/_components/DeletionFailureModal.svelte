<script>
  import { Body, ModalContent, Table } from "@budibase/bbui"
  import { onMount } from "svelte"

  export let deleteUsersResponse

  let successCount
  let title
  let unsuccessfulUsers
  let message

  const setTitle = () => {
    if (successCount) {
      title = `${successCount} 用户已删除`
    } else {
      title = "Oops!"
    }
  }

  const setMessage = () => {
    if (successCount) {
      message = "但是，删除某些用户时出现问题。"
    } else {
      message = "删除某些用户时出现问题。"
    }
  }

  const setUsers = () => {
    unsuccessfulUsers = deleteUsersResponse.unsuccessful.map(user => {
      return {
        email: user.email,
        reason: user.reason,
      }
    })
  }

  onMount(() => {
    successCount = deleteUsersResponse.successful.length
    setTitle()
    setMessage()
    setUsers()
  })

  const schema = {
    email: {},
    reason: {},
  }
</script>

<ModalContent
  size="M"
  {title}
  confirmText="关闭"
  showCloseIcon={false}
  showCancelButton={false}
>
  <Body size="XS">
    {message}
  </Body>
  <Table
    {schema}
    data={unsuccessfulUsers}
    allowEditColumns={false}
    allowEditRows={false}
    allowSelectRows={false}
  />
</ModalContent>

<style>
</style>
