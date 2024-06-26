<script>
  import { notifications, Icon, Body } from "@budibase/bbui"
  import { isActive, goto } from "@roxi/routify"
  import {
    selectedScreen,
    screenStore,
    componentStore,
    userSelectedResourceMap,
    hoverStore,
  } from "stores/builder"
  import NavItem from "components/common/NavItem.svelte"
  import ComponentTree from "./ComponentTree.svelte"
  import { dndStore, DropPosition } from "./dndStore.js"
  import ScreenslotDropdownMenu from "./ScreenslotDropdownMenu.svelte"
  import DNDPositionIndicator from "./DNDPositionIndicator.svelte"
  import ComponentKeyHandler from "./ComponentKeyHandler.svelte"
  import ComponentScrollWrapper from "./ComponentScrollWrapper.svelte"

  let scrolling = false

  $: screenComponentId = `${$screenStore.selectedScreenId}-screen`
  $: navComponentId = `${$screenStore.selectedScreenId}-navigation`

  const toNewComponentRoute = () => {
    if ($isActive(`./:componentId/new`)) {
      $goto(`./:componentId`)
    } else {
      $goto(`./:componentId/new`)
    }
  }

  const onDrop = async () => {
    try {
      await dndStore.actions.drop()
    } catch (error) {
      console.error(error)
      notifications.error("保存组件时出错")
    }
  }

  const handleScroll = e => {
    scrolling = e.target.scrollTop !== 0
  }

  const hover = hoverStore.hover
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="components">
  <div class="header" class:scrolling>
    <Body size="S">组件</Body>
    <div on:click={toNewComponentRoute} class="addButton">
      <Icon name="Add" />
    </div>
  </div>
  <div class="list-panel">
    <ComponentScrollWrapper on:scroll={handleScroll}>
      <ul>
        <li>
          <NavItem
            text="屏幕"
            indentLevel={0}
            selected={$componentStore.selectedComponentId ===
              `${$screenStore.selectedScreenId}-screen`}
            opened
            scrollable
            icon="WebPage"
            on:drop={onDrop}
            on:click={() => {
              componentStore.select(`${$screenStore.selectedScreenId}-screen`)
            }}
            hovering={$hoverStore.componentId === screenComponentId}
            on:mouseenter={() => hover(screenComponentId)}
            on:mouseleave={() => hover(null)}
            id="component-screen"
            selectedBy={$userSelectedResourceMap[screenComponentId]}
          >
            <ScreenslotDropdownMenu component={$selectedScreen?.props} />
          </NavItem>
          <NavItem
            text="导航"
            indentLevel={0}
            selected={$componentStore.selectedComponentId === navComponentId}
            opened
            scrollable
            icon={$selectedScreen?.showNavigation
              ? "Visibility"
              : "VisibilityOff"}
            on:drop={onDrop}
            on:click={() => {
              componentStore.select(
                `${$screenStore.selectedScreenId}-navigation`
              )
            }}
            hovering={$hoverStore.componentId === navComponentId}
            on:mouseenter={() => hover(navComponentId)}
            on:mouseleave={() => hover(null)}
            id="component-nav"
            selectedBy={$userSelectedResourceMap[navComponentId]}
          />
          <ComponentTree
            level={0}
            components={$selectedScreen?.props._children}
          />

          <!-- Show drop indicators for the target and the parent -->
          {#if $dndStore.dragging && $dndStore.valid}
            <DNDPositionIndicator
              component={$dndStore.target}
              position={$dndStore.dropPosition}
            />
            {#if $dndStore.dropPosition !== DropPosition.INSIDE}
              <DNDPositionIndicator
                component={$dndStore.targetParent}
                position={DropPosition.INSIDE}
              />
            {/if}
          {/if}
        </li>
      </ul>
    </ComponentScrollWrapper>
  </div>
  <ComponentKeyHandler />
</div>

<style>
  .components {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .header {
    height: 50px;
    box-sizing: border-box;
    padding: var(--spacing-l);
    display: flex;
    align-items: center;
    border-bottom: 2px solid transparent;
    transition: border-bottom 130ms ease-out;
  }
  .header.scrolling {
    border-bottom: var(--border-light);
  }

  .components :global(.nav-item) {
    padding-right: 8px !important;
  }

  .addButton {
    margin-left: auto;
    color: var(--grey-7);
    cursor: pointer;
  }

  .addButton:hover {
    color: var(--ink);
  }

  .list-panel {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
    position: relative;
  }
  ul,
  li {
    min-width: max-content;
  }
</style>
