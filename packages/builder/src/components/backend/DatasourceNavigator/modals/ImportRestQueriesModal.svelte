<script>
  import { goto } from "@roxi/routify"
  import {
    keepOpen,
    ModalContent,
    notifications,
    Body,
    Layout,
    Tabs,
    Tab,
    Heading,
    TextArea,
    Dropzone,
  } from "@budibase/bbui"
  import { datasources, queries } from "stores/builder"
  import { writable } from "svelte/store"

  export let navigateDatasource = false
  export let datasourceId
  export let createDatasource = false
  export let onCancel

  const data = writable({
    url: "",
    raw: "",
    file: undefined,
  })

  let lastTouched = "url"

  const getData = async () => {
    let dataString

    // parse the file into memory and send as string
    if (lastTouched === "file") {
      dataString = await $data.file.text()
    } else if (lastTouched === "url") {
      const response = await fetch($data.url)
      dataString = await response.text()
    } else if (lastTouched === "raw") {
      dataString = $data.raw
    }

    return dataString
  }

  async function importQueries() {
    try {
      const dataString = await getData()

      if (!datasourceId && !createDatasource) {
        throw new Error("没有数据源id")
      }

      const body = {
        data: dataString,
        datasourceId,
      }

      const importResult = await queries.import(body)
      if (!datasourceId) {
        datasourceId = importResult.datasourceId
      }

      // reload
      await datasources.fetch()
      await queries.fetch()

      if (navigateDatasource) {
        $goto(`./datasource/${datasourceId}`)
      }

      notifications.success(`导入成功。`)
    } catch (error) {
      notifications.error("导入查询时出错")
      return keepOpen
    }
  }
</script>

<ModalContent
  onConfirm={() => importQueries()}
  {onCancel}
  confirmText={"导入"}
  cancelText="返回"
  size="L"
>
  <Layout noPadding>
    <Heading size="S">导入</Heading>
    <Body size="XS"
      >使用以下选项之一导入休息集合</Body
    >
    <Tabs selected="File">
      <!-- Commenting until nginx csp issue resolved -->
      <!-- <Tab title="Link">
        <Input
          bind:value={$data.url}
          on:change={() => (lastTouched = "url")}
          label="Enter a URL"
          placeholder="e.g. https://petstore.swagger.io/v2/swagger.json"
        />
      </Tab> -->
      <Tab title="文件">
        <Dropzone
          gallery={false}
          value={$data.file ? [$data.file] : []}
          on:change={e => {
            $data.file = e.detail?.[0]
            lastTouched = "file"
          }}
          fileTags={[
            "OpenAPI 3.0",
            "OpenAPI 2.0",
            "Swagger 2.0",
            "cURL",
            "YAML",
            "JSON",
          ]}
          maximum={1}
        />
      </Tab>
      <Tab title="原始文本">
        <TextArea
          bind:value={$data.raw}
          on:change={() => (lastTouched = "raw")}
          label={"粘贴原始文本"}
          placeholder={'e.g. curl --location --request GET "https://example.com"'}
        />
      </Tab>
    </Tabs>
  </Layout>
</ModalContent>
