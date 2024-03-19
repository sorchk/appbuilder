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
  title="Migrate column"
  confirmText="Continue"
  cancelText="Cancel"
  onConfirm={migrateUserColumn}
  disabled={error !== undefined}
  size="M"
>
  This operation will kick off a migration of the column "{column.schema.name}"
  to a new column, with the name provided - this operation may take a moment to
  complete.

  <InlineAlert
    type="error"
    header="Are you sure?"
    message="This will leave bindings which utilised the user relationship column in a state where they will need to be updated to use the new column instead."
  />
  <Input bind:value={newColumnName} label="New column name" {error} />
</ModalContent>
