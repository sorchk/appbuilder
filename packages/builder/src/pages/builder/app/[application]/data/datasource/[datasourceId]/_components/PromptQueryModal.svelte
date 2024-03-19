<script>
  import { goto as gotoStore, params as paramsStore } from "@roxi/routify"
  import { Modal, ModalContent, Body, Heading } from "@budibase/bbui"
  import FontAwesomeIcon from "components/common/FontAwesomeIcon.svelte"

  const handleOpen = (modal, params) => {
    if (params["?promptQuery"] && modal?.show) {
      modal.show()
      history.replaceState({}, null, window.location.pathname)
    }
  }

  let modal
  $: params = $paramsStore
  $: goto = $gotoStore
  $: handleOpen(modal, params)
</script>

<Modal bind:this={modal}>
  <ModalContent
    size="L"
    cancelText="取消"
    confirmText="创建新查询"
    onConfirm={() => goto(`../../query/new/${params["datasourceId"]}`)}
    showCloseIcon={false}
  >
    <div slot="header" class="header">
      <FontAwesomeIcon name="fa-solid fa-circle-check" />
      <Heading size="M">您已准备好查询数据！</Heading>
    </div>
    <div class="body">
      <Body>您的数据库已连接并可供使用。</Body>
      <Body
        >使用创建查询 <span>创建</span>, <span>读取</span>,
        <span>更新</span>
        和 <span>删除</span> 函数.</Body
      >
    </div>
  </ModalContent>
</Modal>

<style>
  .header {
    display: flex;
    align-items: center;
  }

  .header :global(svg) {
    margin-right: 10px;
    margin-bottom: 1px;
    color: #009562;
  }

  .body :global(p:first-child) {
    margin-bottom: 16px;
  }

  .body :global(span) {
    font-weight: bold;
  }
</style>
