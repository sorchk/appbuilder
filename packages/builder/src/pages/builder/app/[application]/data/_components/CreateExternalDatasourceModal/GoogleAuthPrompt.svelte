<script>
  import { ModalContent, Body, Layout, Link } from "@budibase/bbui"
  import { organisation } from "stores/portal"
  import GoogleButton from "./GoogleButton.svelte"

  $: isGoogleConfigured = !!$organisation.googleDatasourceConfigured
</script>

<ModalContent
  showConfirmButton={false}
  title={`连接到Google工作表`}
  cancelText="取消"
  size="L"
>
  <!-- check true and false directly, don't render until flag is set -->
  {#if isGoogleConfigured === true}
    <Layout noPadding>
      <Body size="S"
        >使用您的Google帐户进行身份验证以使用Google Sheets集成。</Body
      >
    </Layout>
    <GoogleButton samePage />
  {:else if isGoogleConfigured === false}
    <Body size="S"
      >未启用Google身份验证，请完成Google SSO配置。</Body
    >
    <Link href="/builder/portal/settings/auth">Configure Google SSO</Link>
  {/if}
</ModalContent>
