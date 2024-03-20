<script>
  import { clickOutside, Menu, MenuItem, Helpers } from "@budibase/bbui"
  import { getContext } from "svelte"
  import { NewRowID } from "../lib/constants"

  const {
    focusedRow,
    menu,
    rows,
    columns,
    focusedCellId,
    stickyColumn,
    config,
    copiedCell,
    clipboard,
    dispatch,
    focusedCellAPI,
    focusedRowId,
    notifications,
    isDatasourcePlus,
  } = getContext("grid")

  $: style = makeStyle($menu)
  $: isNewRow = $focusedRowId === NewRowID

  const makeStyle = menu => {
    return `left:${menu.left}px; top:${menu.top}px;`
  }

  const deleteRow = () => {
    rows.actions.deleteRows([$focusedRow])
    menu.actions.close()
    $notifications.success("删除一行")
  }

  const duplicate = async () => {
    menu.actions.close()
    const newRow = await rows.actions.duplicateRow($focusedRow)
    if (newRow) {
      const column = $stickyColumn?.name || $columns[0].name
      $focusedCellId = `${newRow._id}-${column}`
    }
  }

  const copyToClipboard = async value => {
    await Helpers.copyToClipboard(value)
    $notifications.success("已复制到剪贴板")
  }
</script>

{#if $menu.visible}
  <div class="menu" {style} use:clickOutside={() => menu.actions.close()}>
    <Menu>
      <MenuItem
        icon="Copy"
        on:click={clipboard.actions.copy}
        on:click={menu.actions.close}
      >
        复制
      </MenuItem>
      <MenuItem
        icon="Paste"
        disabled={$copiedCell == null || $focusedCellAPI?.isReadonly()}
        on:click={clipboard.actions.paste}
        on:click={menu.actions.close}
      >
        粘贴
      </MenuItem>
      <MenuItem
        icon="Maximize"
        disabled={isNewRow || !$config.canEditRows || !$config.canExpandRows}
        on:click={() => dispatch("edit-row", $focusedRow)}
        on:click={menu.actions.close}
      >
      在模式中编辑行
      </MenuItem>
      <MenuItem
        icon="Copy"
        disabled={isNewRow || !$focusedRow?._id || !$isDatasourcePlus}
        on:click={() => copyToClipboard($focusedRow?._id)}
        on:click={menu.actions.close}
      >
      复制行 _id
      </MenuItem>
      <MenuItem
        icon="Copy"
        disabled={isNewRow || !$focusedRow?._rev}
        on:click={() => copyToClipboard($focusedRow?._rev)}
        on:click={menu.actions.close}
      >
      复制行 _rev
      </MenuItem>
      <MenuItem
        icon="Duplicate"
        disabled={isNewRow || !$config.canAddRows}
        on:click={duplicate}
      >
        复制行
      </MenuItem>
      <MenuItem
        icon="Delete"
        disabled={isNewRow || !$config.canDeleteRows}
        on:click={deleteRow}
      >
        删除行
      </MenuItem>
    </Menu>
  </div>
{/if}

<style>
  .menu {
    position: absolute;
    background: var(--cell-background);
    border: 1px solid var(--spectrum-global-color-gray-300);
    width: 180px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 20px -4px rgba(0, 0, 0, 0.15);
  }
</style>
