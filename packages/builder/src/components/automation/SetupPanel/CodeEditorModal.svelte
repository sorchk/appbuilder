<script>
  import { Button, Modal, ModalContent } from "@budibase/bbui"

  let modal

  export const show = () => {
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    size="XL"
    title="编辑代码"
    showConfirmButton={false}
    showCancelButton={false}
  >
    <div class="container">
      <slot />
    </div>
  </ModalContent>
</Modal>
<div class="center">
  <Button primary on:click={show}>编辑代码</Button>
</div>

<style>
  .container :global(section > header) {
    /* Fix margin defined in BBUI as L rather than XL */
    margin-bottom: var(--spacing-xl);
  }
  .container :global(textarea) {
    min-height: 60px;
  }

  .center {
    display: flex;
    justify-content: center;
  }
</style>
