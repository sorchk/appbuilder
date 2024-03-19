<script>
  import { Tabs, Tab, Heading, Body, Layout } from "@budibase/bbui"
  import { datasources, integrations } from "stores/builder"
  import ICONS from "components/backend/DatasourceNavigator/icons"
  import EditDatasourceConfig from "./_components/EditDatasourceConfig.svelte"
  import TablesPanel from "./_components/panels/Tables/index.svelte"
  import RelationshipsPanel from "./_components/panels/Relationships.svelte"
  import QueriesPanel from "./_components/panels/Queries/index.svelte"
  import RestHeadersPanel from "./_components/panels/Headers.svelte"
  import RestAuthenticationPanel from "./_components/panels/Authentication/index.svelte"
  import RestVariablesPanel from "./_components/panels/Variables/index.svelte"
  import PromptQueryModal from "./_components/PromptQueryModal.svelte"
  import SettingsPanel from "./_components/panels/Settings.svelte"
  import { helpers } from "@budibase/shared-core"
  import { admin } from "stores/portal"
  import { IntegrationTypes } from "constants/backend"

  let selectedPanel = null
  let panelOptions = []

  $: datasource = $datasources.selected

  $: isCloud = $admin.cloud
  $: isPostgres = datasource?.source === IntegrationTypes.POSTGRES
  $: getOptions(datasource)

  const getOptions = datasource => {
    if (datasource.plus) {
      // Google Sheets' integration definition specifies `relationships: false` as it doesn't support relationships like other plus datasources
      panelOptions =
        $integrations[datasource.source].relationships === false
          ? ["表", "查询"]
          : ["表", "关系", "查询"]
      selectedPanel = panelOptions.includes(selectedPanel)
        ? selectedPanel
        : "表"
    } else if (datasource.source === "REST") {
      panelOptions = ["查询", "头", "认证", "变量"]
      selectedPanel = panelOptions.includes(selectedPanel)
        ? selectedPanel
        : "查询"
    } else {
      panelOptions = ["查询"]
      selectedPanel = "查询"
    }
    // always the last option for SQL
    if (helpers.isSQL(datasource)) {
      if (isCloud && isPostgres) {
        // We don't show the settings panel for Postgres on Budicloud because
        // it requires pg_dump to work and we don't want to enable shell injection
        // attacks.
      } else {
        panelOptions.push("设置")
      }
    }
  }
</script>

<PromptQueryModal />

<section>
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <header>
        <svelte:component
          this={ICONS[datasource.source]}
          height="26"
          width="26"
        />
        <Heading size="M">{$datasources.selected?.name}</Heading>
      </header>
    </Layout>
    <EditDatasourceConfig {datasource} />
    <div class="tabs">
      <Tabs size="L" noPadding noHorizPadding selected={selectedPanel}>
        {#each panelOptions as panelOption}
          <Tab
            title={panelOption}
            on:click={() => (selectedPanel = panelOption)}
          />
        {/each}
      </Tabs>
    </div>

    {#if selectedPanel === null}
      <Body>loading...</Body>
    {:else if selectedPanel === "表"}
      <TablesPanel {datasource} />
    {:else if selectedPanel === "关系"}
      <RelationshipsPanel {datasource} />
    {:else if selectedPanel === "查询"}
      <QueriesPanel {datasource} />
    {:else if selectedPanel === "头"}
      <RestHeadersPanel {datasource} />
    {:else if selectedPanel === "认证"}
      <RestAuthenticationPanel {datasource} />
    {:else if selectedPanel === "变量"}
      <RestVariablesPanel {datasource} />
    {:else if selectedPanel === "设置"}
      <SettingsPanel {datasource} />
    {:else}
      <Body>出了问题</Body>
    {/if}
  </Layout>
</section>

<style>
  section {
    margin: 0 auto;
    width: 640px;
  }

  header {
    margin-top: 35px;
    display: flex;
    gap: var(--spacing-l);
    align-items: center;
    margin-bottom: 12px;
  }

  .tabs {
  }
</style>
