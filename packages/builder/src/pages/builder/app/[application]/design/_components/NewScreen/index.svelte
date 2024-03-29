<script>
  import { Body } from "@budibase/bbui"
  import CreationPage from "components/common/CreationPage.svelte"
  import blankImage from "./images/blank.png"
  import tableInline from "./images/tableInline.png"
  import tableDetails from "./images/tableDetails.png"
  import formImage from "./images/form.png"
  import CreateScreenModal from "./CreateScreenModal.svelte"
  import { screenStore } from "stores/builder"

  export let onClose = null

  let createScreenModal

  $: hasScreens = $screenStore.screens?.length
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="page">
  <CreationPage
    showClose={!!onClose}
    {onClose}
    heading={hasScreens ? "创建新屏幕" : "创建您的第一个屏幕"}
  >
    <div class="subHeading">
      <Body>从头开始或根据数据创建屏幕</Body>
    </div>

    <div class="cards">
      <div class="card" on:click={() => createScreenModal.show("blank")}>
        <div class="image">
          <img alt="" src={blankImage} />
        </div>
        <div class="text">
          <Body size="S">空白屏幕</Body>
          <Body size="XS">添加空白屏幕</Body>
        </div>
      </div>

      <div class="card" on:click={() => createScreenModal.show("grid")}>
        <div class="image">
          <img alt="" src={tableInline} />
        </div>
        <div class="text">
          <Body size="S">表</Body>
          <Body size="XS">查看、编辑和删除表上的行</Body>
        </div>
      </div>

      <div class="card" on:click={() => createScreenModal.show("gridDetails")}>
        <div class="image">
          <img alt="" src={tableDetails} />
        </div>
        <div class="text">
          <Body size="S">网格</Body>
          <Body size="XS">查看和操作网格上的行</Body>
        </div>
      </div>

      <div class="card" on:click={() => createScreenModal.show("form")}>
        <div class="image">
          <img alt="" src={formImage} />
        </div>
        <div class="text">
          <Body size="S">表单</Body>
          <Body size="XS">用户填写表单数据</Body>
        </div>
      </div>
    </div>
  </CreationPage>
</div>

<CreateScreenModal bind:this={createScreenModal} />

<style>
  .page {
    padding: 28px 40px 40px 40px;
  }

  .subHeading :global(p) {
    text-align: center;
    margin-top: 12px;
    margin-bottom: 36px;
    color: var(--spectrum-global-color-gray-600);
  }

  .cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 24px;
  }

  .card {
    max-width: 235px;
    transition: filter 150ms;
  }

  .card:hover {
    filter: brightness(1.1);
    cursor: pointer;
  }

  .image {
    border-radius: 4px 4px 0 0;
    width: 100%;
    max-height: 127px;
    overflow: hidden;
  }

  .image img {
    width: 100%;
  }

  .card .image {
    min-height: 130px;
    min-width: 235px;
  }

  .text {
    border: 1px solid var(--grey-4);
    border-radius: 0 0 4px 4px;
    padding: 8px 16px 13px 16px;
  }

  .text :global(p:nth-child(1)) {
    margin-bottom: 6px;
  }

  .text :global(p:nth-child(2)) {
    color: var(--grey-6);
  }
</style>
