<script>
  import { goto } from "@roxi/routify"
  import { Table } from "@budibase/bbui"
  import ArrayRenderer from "components/common/renderers/ArrayRenderer.svelte"
  import Controls from "./Controls.svelte"
  import Panel from "../Panel.svelte"
  import Tooltip from "../Tooltip.svelte"

  export let datasource

  let tableSchema = {
    name: {},
    primary: { displayName: "主键" },
  }
</script>

<Panel>
  <Controls slot="controls" {datasource} />
  <Tooltip
    slot="tooltip"
    title="在应用中使用数据"
    href="https://docs.budibase.com/docs/data"
  />
  <Table
    on:click={({ detail: table }) => $goto(`../../table/${table._id}`)}
    schema={tableSchema}
    data={Object.values(datasource?.entities || {})}
    allowEditColumns={false}
    allowEditRows={false}
    allowSelectRows={false}
    customRenderers={[{ column: "primary", component: ArrayRenderer }]}
  />
</Panel>
