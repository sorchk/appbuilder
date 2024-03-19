<script>
  import { url } from "@roxi/routify"
  import { Layout, Page } from "@budibase/bbui"
  import TemplateDisplay from "components/common/TemplateDisplay.svelte"
  import { templates } from "stores/portal"
  import { Breadcrumbs, Breadcrumb, Header } from "components/portal/page"
</script>

<Page>
  <Layout noPadding gap="L">
    <Breadcrumbs>
      <Breadcrumb url={$url("./")} text="应用" />
      <Breadcrumb text="模板" />
    </Breadcrumbs>
    <Header title="模板" />
    <TemplateDisplay templates={$templates} />
  </Layout>
</Page>
