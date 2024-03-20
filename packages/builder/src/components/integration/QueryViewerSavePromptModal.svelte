<script>
  import { goto, beforeUrlChange } from "@roxi/routify"
  import { Body, Modal, ModalContent } from "@budibase/bbui"

  export let checkIsModified = () => {}
  export let attemptSave = () => {}
  let modal
  let navigateTo
  let override = false

  $beforeUrlChange(event => {
    if (checkIsModified() && !override) {
      navigateTo = event.type == "pushstate" ? event.url : null
      modal.show()
      return false
    } else return true
  })

  const resumeNavigation = () => {
    if (typeof navigateTo == "string") {
      $goto(typeof navigateTo == "string" ? `${navigateTo}` : navigateTo)
    }
  }
</script>

<Modal
  bind:this={modal}
  on:hide={() => {
    navigateTo = null
  }}
>
  <ModalContent
    title="您有未保存的更改"
    confirmText="保存并继续"
    cancelText="放弃更改"
    size="L"
    onConfirm={async () => {
      try {
        await attemptSave()
        override = true
        resumeNavigation()
      } catch (e) {
        navigateTo = false
      }
    }}
    onCancel={async () => {
      override = true
      resumeNavigation()
    }}
  >
    <Body>离开此部分将意味着丢失对查询的任何更改</Body>
  </ModalContent>
</Modal>
