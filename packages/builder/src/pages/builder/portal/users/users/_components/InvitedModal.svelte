<script>
  import { Body, ModalContent, Table } from "@budibase/bbui"
  import { onMount } from "svelte"
  import InviteResponseRenderer from "./InviteResponseRenderer.svelte"

  export let inviteUsersResponse

  let hasSuccess
  let hasFailure
  let title
  let failureMessage

  let unsuccessfulUsers

  const setTitle = () => {
    if (hasSuccess) {
      title = "邀请用户！"
    } else if (hasFailure) {
      title = "Oops!"
    }
  }

  const setFailureMessage = () => {
    if (hasSuccess) {
      failureMessage = "但是，在邀请一些用户时出现了问题。"
    } else {
      failureMessage = "邀请用户时出现问题。"
    }
  }

  const setUsers = () => {
    unsuccessfulUsers = inviteUsersResponse.unsuccessful.map(user => {
      return {
        email: user.email,
        reason: user.reason,
      }
    })
  }

  onMount(() => {
    hasSuccess = inviteUsersResponse.successful.length
    hasFailure = inviteUsersResponse.unsuccessful.length
    setTitle()
    setFailureMessage()
    setUsers()
  })

  const failedSchema = {
    email: {},
    reason: {},
  }
</script>

<ModalContent size="L" showCancelButton={false} {title} confirmText="完成">
  {#if hasSuccess}
    <Body size="XS">
      您的用户现在应该收到一封电子邮件邀请，以访问他们的帐户
    </Body>
  {/if}
  {#if hasFailure}
    <Body size="XS">
      {failureMessage}
    </Body>
    <Table
      schema={failedSchema}
      data={unsuccessfulUsers}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
      customRenderers={[
        { column: "reason", component: InviteResponseRenderer },
      ]}
    />
  {/if}
</ModalContent>
