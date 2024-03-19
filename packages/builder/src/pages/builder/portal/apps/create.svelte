<script>
  import { url } from "@roxi/routify"
  import FirstAppOnboarding from "./onboarding/index.svelte"
  import { Layout, Page, Button, Modal } from "@budibase/bbui"
  import CreateAppModal from "components/start/CreateAppModal.svelte"
  import TemplateDisplay from "components/common/TemplateDisplay.svelte"
  import AppLimitModal from "components/portal/licensing/AppLimitModal.svelte"
  import { appsStore, templates, licensing } from "stores/portal"
  import { Breadcrumbs, Breadcrumb, Header } from "components/portal/page"

  let template
  let creationModal = false
  let appLimitModal

  const initiateAppCreation = () => {
    if ($licensing?.usageMetrics?.apps >= 100) {
      appLimitModal.show()
    } else {
      template = null
      creationModal.show()
    }
  }

  const stopAppCreation = () => {
    template = null
  }

  const initiateAppImport = () => {
    if ($licensing?.usageMetrics?.apps >= 100) {
      appLimitModal.show()
    } else {
      template = { fromFile: true }
      creationModal.show()
    }
  }
</script>

{#if !$appsStore.apps.length}
  <FirstAppOnboarding />
{:else}
  <Page>
    <Layout noPadding gap="L">
      <Breadcrumbs>
        <Breadcrumb url={$url("./")} text="应用" />
        <Breadcrumb text="创建新应用" />
      </Breadcrumbs>
      <Header title={"创建新应用"}>
        <div slot="buttons">
          <Button size="M" secondary on:click={initiateAppImport}>
            导入应用
          </Button>
          <Button size="M" cta on:click={initiateAppCreation}>
            创建新应用
          </Button>
        </div>
      </Header>
      <TemplateDisplay templates={$templates} />
    </Layout>
  </Page>
  <Modal
    bind:this={creationModal}
    padding={false}
    width="600px"
    on:hide={stopAppCreation}
  >
    <CreateAppModal {template} />
  </Modal>
  <AppLimitModal bind:this={appLimitModal} />
{/if}
