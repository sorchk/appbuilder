<script>
  import { getContext } from "svelte"
  import { ActionButton, Popover, Select } from "@budibase/bbui"
  import { canBeSortColumn } from "@budibase/shared-core"

  const { sort, columns, stickyColumn } = getContext("grid")

  let open = false
  let anchor

  $: columnOptions = getColumnOptions($stickyColumn, $columns)
  $: orderOptions = getOrderOptions($sort.column, columnOptions)

  const getColumnOptions = (stickyColumn, columns) => {
    let options = []
    if (stickyColumn) {
      options.push({
        label: stickyColumn.label || stickyColumn.name,
        value: stickyColumn.name,
        type: stickyColumn.schema?.type,
      })
    }
    options = [
      ...options,
      ...columns.map(col => ({
        label: col.label || col.name,
        value: col.name,
        type: col.schema?.type,
      })),
    ]
    return options.filter(col => canBeSortColumn(col.type))
  }

  const getOrderOptions = (column, columnOptions) => {
    const type = columnOptions.find(col => col.value === column)?.type
    return [
      {
        label: type === "number" ? "Low-high" : "A-Z",
        value: "升序asc",
      },
      {
        label: type === "number" ? "High-low" : "Z-A",
        value: "降序desc",
      },
    ]
  }

  const updateSortColumn = e => {
    sort.update(state => ({
      column: e.detail,
      order: e.detail ? state.order : "ascending",
    }))
  }

  const updateSortOrder = e => {
    sort.update(state => ({
      ...state,
      order: e.detail,
    }))
  }
</script>

<div bind:this={anchor}>
  <ActionButton
    icon="SortOrderDown"
    quiet
    size="M"
    on:click={() => (open = !open)}
    selected={open}
    disabled={!columnOptions.length}
  >
    排序
  </ActionButton>
</div>

<Popover bind:open {anchor} align="left">
  <div class="content">
    <Select
      placeholder="默认"
      value={$sort.column}
      options={columnOptions}
      autoWidth
      on:change={updateSortColumn}
      label="列"
    />
    {#if $sort.column}
      <Select
        placeholder={null}
        value={$sort.order || "ascending"}
        options={orderOptions}
        autoWidth
        on:change={updateSortOrder}
        label="排序"
      />
    {/if}
  </div>
</Popover>

<style>
  .content {
    padding: 6px 12px 12px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .content :global(.spectrum-Picker) {
    width: 140px;
  }
</style>
