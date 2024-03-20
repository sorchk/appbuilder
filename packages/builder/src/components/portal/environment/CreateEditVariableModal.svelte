<script>
  import {
    ModalContent,
    Button,
    Input,
    Checkbox,
    Heading,
    notifications,
    Context,
  } from "@budibase/bbui"
  import { environment } from "stores/portal"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { getContext } from "svelte"

  const modalContext = getContext(Context.Modal)

  export let save
  export let row

  let deleteDialog
  let name = row?.name || ""
  let productionValue
  let developmentValue
  let useProductionValue = true

  const HasSpacesRegex = /[\\"\s]/

  const deleteVariable = async name => {
    try {
      await environment.deleteVariable(name)
      modalContext.hide()
      notifications.success("Environment variable deleted")
    } catch (err) {
      notifications.error(err.message)
    }
  }

  const saveVariable = async () => {
    try {
      await save({
        name,
        production: productionValue,
        development: developmentValue,
      })
      notifications.success("Environment variable saved")
    } catch (err) {
      notifications.error(`Error saving environment variable - ${err.message}`)
    }
  }
</script>

<ModalContent
  disabled={HasSpacesRegex.test(name)}
  onConfirm={() => saveVariable()}
  title={!row ? "添加新的环境变量" : "编辑环境变量"}
>
  <Input
    disabled={row}
    label="名称"
    bind:value={name}
    error={HasSpacesRegex.test(name) && "不得包含空格"}
  />
  <div>
    <Heading size="XS">生产环境</Heading>
    <Input
      type="password"
      label="值"
      on:change={e => {
        productionValue = e.detail
        if (useProductionValue) {
          developmentValue = e.detail
        }
      }}
      value={productionValue}
      autocomplete="new-password"
    />
  </div>
  <div>
    <Heading size="XS">开发环境</Heading>
    <Input
      type="password"
      on:change={e => {
        developmentValue = e.detail
      }}
      disabled={useProductionValue}
      label="值"
      value={useProductionValue ? productionValue : developmentValue}
      autocomplete="new-password"
    />
    <Checkbox bind:value={useProductionValue} text="使用生产环境配置的值" />
  </div>

  <div class="footer" slot="footer">
    {#if row}
      <Button on:click={deleteDialog.show} warning>删除</Button>
    {/if}
  </div>
</ModalContent>

<ConfirmDialog
  bind:this={deleteDialog}
  onOk={() => {
    deleteVariable(row.name)
  }}
  okText="删除环境变量"
  title="确认删除"
>
  您确定要删除环境变量吗
  <i>{row.name}?</i>
  此操作无法撤消。
</ConfirmDialog>
