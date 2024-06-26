<script>
  import { Select, Icon } from "@budibase/bbui"
  import { FIELDS } from "constants/backend"
  import { API } from "api"
  import { parseFile } from "./utils"
  import { canBeDisplayColumn } from "@budibase/shared-core"

  export let rows = []
  export let schema = {}
  export let allValid = true
  export let displayColumn = null
  export let promptUpload = false

  const typeOptions = {
    [FIELDS.STRING.type]: {
      label: "文本",
      value: FIELDS.STRING.type,
      config: {
        type: FIELDS.STRING.type,
        constraints: FIELDS.STRING.constraints,
      },
    },
    [FIELDS.NUMBER.type]: {
      label: "数字",
      value: FIELDS.NUMBER.type,
      config: {
        type: FIELDS.NUMBER.type,
        constraints: FIELDS.NUMBER.constraints,
      },
    },
    [FIELDS.DATETIME.type]: {
      label: "日期",
      value: FIELDS.DATETIME.type,
      config: {
        type: FIELDS.DATETIME.type,
        constraints: FIELDS.DATETIME.constraints,
      },
    },
    [FIELDS.OPTIONS.type]: {
      label: "选项",
      value: FIELDS.OPTIONS.type,
      config: {
        type: FIELDS.OPTIONS.type,
        constraints: FIELDS.OPTIONS.constraints,
      },
    },
    [FIELDS.ARRAY.type]: {
      label: "多项选择",
      value: FIELDS.ARRAY.type,
      config: {
        type: FIELDS.ARRAY.type,
        constraints: FIELDS.ARRAY.constraints,
      },
    },
    [FIELDS.BARCODEQR.type]: {
      label: "条形码/二维码",
      value: FIELDS.BARCODEQR.type,
      config: {
        type: FIELDS.BARCODEQR.type,
        constraints: FIELDS.BARCODEQR.constraints,
      },
    },
    [FIELDS.LONGFORM.type]: {
      label: "长格式文本",
      value: FIELDS.LONGFORM.type,
      config: {
        type: FIELDS.LONGFORM.type,
        constraints: FIELDS.LONGFORM.constraints,
      },
    },
    user: {
      label: "用户",
      value: "user",
      config: {
        type: FIELDS.USER.type,
        subtype: FIELDS.USER.subtype,
        constraints: FIELDS.USER.constraints,
      },
    },
    users: {
      label: "多用户",
      value: "users",
      config: {
        type: FIELDS.USERS.type,
        subtype: FIELDS.USERS.subtype,
        constraints: FIELDS.USERS.constraints,
      },
    },
  }

  let fileInput
  let error = null
  let fileName = null
  let loading = false
  let validation = {}
  let validateHash = ""
  let errors = {}
  let selectedColumnTypes = {}

  $: displayColumnOptions = Object.keys(schema || {}).filter(column => {
    return validation[column] && canBeDisplayColumn(schema[column].type)
  })

  $: if (displayColumn && !canBeDisplayColumn(schema[displayColumn].type)) {
    displayColumn = null
  }

  $: {
    // binding in consumer is causing double renders here
    const newValidateHash = JSON.stringify(rows) + JSON.stringify(schema)
    if (newValidateHash !== validateHash) {
      validate(rows, schema)
    }
    validateHash = newValidateHash
  }
  $: openFileUpload(promptUpload, fileInput)

  async function handleFile(e) {
    loading = true
    error = null
    validation = {}

    try {
      const response = await parseFile(e)
      rows = response.rows
      schema = response.schema
      fileName = response.fileName
      selectedColumnTypes = Object.entries(response.schema).reduce(
        (acc, [colName, fieldConfig]) => ({
          ...acc,
          [colName]: fieldConfig.type,
        }),
        {}
      )
    } catch (e) {
      loading = false
      error = e
    }
  }

  async function validate(rows, schema) {
    loading = true
    try {
      if (rows.length > 0) {
        const response = await API.validateNewTableImport({ rows, schema })
        validation = response.schemaValidation
        allValid = response.allValid
        errors = response.errors
        error = null
      }
    } catch (e) {
      error = e.message
      validation = {}
      allValid = false
      errors = {}
    }
    loading = false
  }

  const handleChange = (name, e) => {
    const { config } = typeOptions[e.detail]
    schema[name].type = config.type
    schema[name].subtype = config.subtype
    schema[name].constraints = config.constraints
  }

  const openFileUpload = (promptUpload, fileInput) => {
    if (promptUpload && fileInput) {
      fileInput.click()
    }
  }

  const deleteColumn = name => {
    if (loading) {
      return
    }
    delete schema[name]
    schema = schema
  }
</script>

<div class="dropzone">
  <input
    bind:this={fileInput}
    disabled={loading}
    id="file-upload"
    accept="text/csv,application/json"
    type="file"
    on:change={handleFile}
  />
  <label for="file-upload" class:uploaded={rows.length > 0}>
    {#if error}
      Error: {error}
    {:else if fileName}
      {fileName}
    {:else}
      上传
    {/if}
  </label>
</div>
{#if rows.length > 0 && !error}
  <div class="schema-fields">
    {#each Object.entries(schema) as [name, column]}
      <div class="field">
        <span>{column.name}</span>
        <Select
          bind:value={selectedColumnTypes[column.name]}
          on:change={e => handleChange(name, e)}
          options={Object.values(typeOptions)}
          placeholder={null}
          getOptionLabel={option => option.label}
          getOptionValue={option => option.value}
        />
        <span
          class={validation[column.name]
            ? "fieldStatusSuccess"
            : "fieldStatusFailure"}
        >
          {#if validation[column.name]}
            成功
          {:else}
            失败
            {#if errors[column.name]}
              <Icon name="Help" tooltip={errors[column.name]} />
            {/if}
          {/if}
        </span>
        <Icon
          size="S"
          name="Close"
          hoverable
          on:click={() => deleteColumn(column.name)}
        />
      </div>
    {/each}
  </div>
  <div class="display-column">
    <Select
      label="显示列"
      bind:value={displayColumn}
      options={displayColumnOptions}
      sort
    />
  </div>
{/if}

<style>
  .dropzone {
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 10px;
    transition: all 0.3s;
  }

  input {
    display: none;
  }

  label {
    cursor: pointer;
    font-weight: 600;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: var(--border-radius-s);
    color: var(--ink);
    padding: var(--spacing-m) var(--spacing-l);
    transition: all 0.2s ease 0s;
    display: inline-flex;
    text-rendering: optimizeLegibility;
    min-width: auto;
    outline: none;
    font-feature-settings: "case" 1, "rlig" 1, "calt" 0;
    -webkit-box-align: center;
    user-select: none;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    background-color: var(--grey-2);
    font-size: var(--font-size-xs);
    line-height: normal;
    border: var(--border-transparent);
  }

  .uploaded {
    color: var(--blue);
  }

  .schema-fields {
    margin-top: var(--spacing-xl);
  }

  .field {
    display: grid;
    grid-template-columns: 2fr 2fr 1fr auto;
    margin-top: var(--spacing-m);
    align-items: center;
    grid-gap: var(--spacing-m);
    font-size: var(--spectrum-global-dimension-font-size-75);
  }

  .fieldStatusSuccess {
    color: var(--green);
    justify-self: center;
    font-weight: 600;
  }
  .fieldStatusFailure {
    color: var(--red);
    justify-self: center;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .fieldStatusFailure :global(.spectrum-Icon) {
    width: 12px;
  }

  .display-column {
    margin-top: var(--spacing-xl);
  }
</style>
