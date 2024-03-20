<script>
  import { componentStore } from "stores/builder"
  import { ActionMenu, MenuItem, Icon } from "@budibase/bbui"

  export let component
  export let opened

  $: definition = componentStore.getDefinition(component?._component)
  $: noPaste = !$componentStore.componentToPaste
  $: isBlock = definition?.block === true
  $: canEject = !(definition?.ejectable === false)

  const keyboardEvent = (key, ctrlKey = false) => {
    document.dispatchEvent(
      new CustomEvent("component-menu", {
        detail: {
          key,
          ctrlKey,
          id: component?._id,
        },
      })
    )
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem
    icon="Delete"
    keyBind="!BackAndroid"
    on:click={() => keyboardEvent("Delete")}
  >
    删除
  </MenuItem>
  {#if isBlock && canEject}
    <MenuItem
      icon="Export"
      keyBind="Ctrl+E"
      on:click={() => keyboardEvent("e", true)}
    >
    弹出块
    </MenuItem>
  {/if}
  <MenuItem
    icon="ChevronUp"
    keyBind="Ctrl+!ArrowUp"
    on:click={() => keyboardEvent("ArrowUp", true)}
  >
    上移
  </MenuItem>
  <MenuItem
    icon="ChevronDown"
    keyBind="Ctrl+!ArrowDown"
    on:click={() => keyboardEvent("ArrowDown", true)}
  >
    下移
  </MenuItem>
  <MenuItem
    icon="Duplicate"
    keyBind="Ctrl+D"
    on:click={() => keyboardEvent("d", true)}
  >
    副本
  </MenuItem>
  <MenuItem
    icon="Cut"
    keyBind="Ctrl+X"
    on:click={() => keyboardEvent("x", true)}
  >
    剪切
  </MenuItem>
  <MenuItem
    icon="Copy"
    keyBind="Ctrl+C"
    on:click={() => keyboardEvent("c", true)}
  >
    复制
  </MenuItem>
  <MenuItem
    icon="LayersSendToBack"
    keyBind="Ctrl+V"
    on:click={() => keyboardEvent("v", true)}
    disabled={noPaste}
  >
    粘贴
  </MenuItem>

  {#if component?._children?.length}
    <MenuItem
      icon="TreeExpand"
      keyBind="!ArrowRight"
      on:click={() => keyboardEvent("ArrowRight", false)}
      disabled={opened}
    >
      展开
    </MenuItem>
    <MenuItem
      icon="TreeCollapse"
      keyBind="!ArrowLeft"
      on:click={() => keyboardEvent("ArrowLeft", false)}
      disabled={!opened}
    >
      收起
    </MenuItem>
    <MenuItem
      icon="TreeExpandAll"
      keyBind="Ctrl+!ArrowRight"
      on:click={() => keyboardEvent("ArrowRight", true)}
    >
      展开所有
    </MenuItem>
    <MenuItem
      icon="TreeCollapseAll"
      keyBind="Ctrl+!ArrowLeft"
      on:click={() => keyboardEvent("ArrowLeft", true)}
    >
      收起所有
    </MenuItem>
  {/if}
</ActionMenu>

<style>
  .icon {
    display: grid;
    place-items: center;
  }
</style>
