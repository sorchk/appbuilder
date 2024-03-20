<script>
  import {
    keepOpen,
    ColorPicker,
    Body,
    ModalContent,
    Input,
    IconPicker,
  } from "@budibase/bbui"

  export let group
  export let saveGroup

  let readonlyTitle = group?.scimInfo?.isSync

  let nameError
</script>

<ModalContent
  onConfirm={() => {
    if (!group.name?.trim()) {
      nameError = "组名称不能为空"
      return keepOpen
    }
    saveGroup(group)
  }}
  size="M"
  title={group?._rev ? "编辑组" : "创建组"}
  confirmText="保存"
>
  <Input
    bind:value={group.name}
    label="名称"
    error={nameError}
    disabled={readonlyTitle}
  />
  <div class="modal-format">
    <div class="modal-inner">
      <Body size="XS">Icon</Body>
      <div class="modal-spacing">
        <IconPicker
          bind:value={group.icon}
          on:change={e => (group.icon = e.detail)}
        />
      </div>
    </div>
    <div class="modal-inner">
      <Body size="XS">Color</Body>
      <div class="modal-spacing">
        <ColorPicker
          bind:value={group.color}
          on:change={e => (group.color = e.detail)}
        />
      </div>
    </div>
  </div>
</ModalContent>

<style>
  .modal-format {
    display: flex;
    justify-content: space-between;
    width: 40%;
  }

  .modal-inner {
    display: flex;
    align-items: center;
  }

  .modal-spacing {
    margin-left: var(--spacing-l);
  }
</style>
