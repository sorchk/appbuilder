<script>
  import {
    Layout,
    Heading,
    Body,
    Button,
    Select,
    Divider,
    Modal,
    Search,
    Page,
    Table,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { plugins, admin } from "stores/portal"
  import AddPluginModal from "./_components/AddPluginModal.svelte"
  import PluginNameRenderer from "./_components/PluginNameRenderer.svelte"
  import EditPluginRenderer from "./_components/EditPluginRenderer.svelte"

  const schema = {
    name: {
      width: "2fr",
      minWidth: "200px",
    },
    version: {
      width: "1fr",
    },
    "schema.type": {
      width: "1fr",
      displayName: "类型",
      capitalise: true,
      minWidth: "120px",
    },
    edit: {
      width: "auto",
      borderLeft: true,
      displayName: "",
    },
  }
  const customRenderers = [
    { column: "name", component: PluginNameRenderer },
    { column: "edit", component: EditPluginRenderer },
  ]

  let modal
  let searchTerm = ""
  let filter = "all"
  let filterOptions = [
    { label: "所有插件", value: "all" },
    { label: "组件", value: "component" },
  ]

  if (!$admin.cloud) {
    filterOptions.push({ label: "数据源", value: "datasource" })
  }

  $: filteredPlugins = $plugins
    .filter(plugin => {
      return filter === "all" || plugin.schema.type === filter
    })
    .filter(plugin => {
      return (
        !searchTerm ||
        plugin?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

  onMount(async () => {
    await plugins.load()
  })
</script>

<Page narrow>
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <Heading size="M">插件</Heading>
      <Body>添加您自己的自定义数据源和组件</Body>
    </Layout>
    <Divider />

    <div class="controls">
      <div>
        <Button on:click={modal.show} cta>添加插件</Button>
        <div class="secondaryButton">
          <Button
            on:click={() =>
              window
                .open("https://github.com/Budibase/plugins", "_blank")
                .focus()}
            secondary
          >
            GitHub repo
          </Button>
        </div>
      </div>
      {#if $plugins?.length}
        <div class="filters">
          <div class="select">
            <Select
              bind:value={filter}
              placeholder={null}
              options={filterOptions}
              autoWidth
            />
          </div>
          <Search bind:value={searchTerm} placeholder="搜索" />
        </div>
      {/if}
    </div>

    {#if $plugins?.length}
      <Table
        {schema}
        data={filteredPlugins}
        allowEditColumns={false}
        allowEditRows={false}
        allowSelectRows={false}
        allowClickRows={false}
        {customRenderers}
      />
    {/if}
  </Layout>
</Page>

<Modal bind:this={modal}>
  <AddPluginModal />
</Modal>

<style>
  .filters {
    display: flex;
    gap: var(--spacing-xl);
  }
  .controls {
    display: flex;
    gap: var(--spacing-xl);
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .controls :global(.spectrum-Search) {
    width: 200px;
  }

  @media (max-width: 640px) {
    .filters {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    .controls :global(.spectrum-Search) {
      width: auto;
    }
  }

  .secondaryButton {
    display: inline-block;
    margin-left: 6px;
  }
</style>
