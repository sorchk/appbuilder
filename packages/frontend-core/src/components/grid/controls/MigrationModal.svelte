<script>
  import {
    ModalContent,
    notifications,
    Input,
    InlineAlert,
  } from "@budibase/bbui"
  import { getContext } from "svelte"
  import { ValidColumnNameRegex } from "@budibase/shared-core"
  import { FieldSubtype, FieldType, RelationshipType } from "@budibase/types"

  const { API, definition, rows } = getContext("grid")

  export let column

  let newColumnName = `${column.schema.name} migrated`
  $: error = checkNewColumnName(newColumnName)

  const checkNewColumnName = newColumnName => {
    if (newColumnName === "") {
      return "列名不能为空。"
    }
    if (newColumnName in $definition.schema) {
      return "新列名不能与现有列名相同。"
    }
    if (newColumnName.match(ValidColumnNameRegex) === null) {
      return "非法字符；必须是字母数字。"
    }
  }

  const migrateUserColumn = async () => {
    let subtype = FieldSubtype.USERS
    if (column.schema.relationshipType === RelationshipType.ONE_TO_MANY) {
      subtype = FieldSubtype.USER
    }

    try {
      await API.migrateColumn({
        tableId: $definition._id,
        oldColumn: column.schema,
        newColumn: {
          name: newColumnName,
          type: FieldType.BB_REFERENCE,
          subtype,
        },
      })
      notifications.success("已迁移列")
    } catch (e) {
      notifications.error(`迁移失败: ${e.message}`)
    }
    await rows.actions.refreshData()
  }
</script>

<ModalContent
  title="迁移列"
  confirmText="继续"
  cancelText="取消"
  onConfirm={migrateUserColumn}
  disabled={error !== undefined}
  size="M"
>
  此操作将启动列"{column.schema.name}"的迁移到一个新列，并提供名称-此操作可能需要一些时间完成
  <InlineAlert
    type="error"
    header="你确定吗？"
    message="这将使使用用户关系列的绑定处于需要更新以使用新列的状态。"
  />
  <Input bind:value={newColumnName} label="新的列名称" {error} />
</ModalContent>
