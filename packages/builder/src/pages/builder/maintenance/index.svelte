<script>
  import { MaintenanceType } from "@budibase/types"
  import { Heading, Body, Button, Layout } from "@budibase/bbui"
  import { admin } from "stores/portal"
  import BudibaseLogo from "../portal/_components/BudibaseLogo.svelte"

  $: {
    if ($admin.maintenance.length === 0) {
      window.location = "/builder"
    }
  }
</script>

<div class="main">
  <div class="content">
    <div class="hero">
      <BudibaseLogo />
    </div>
    <div class="inner-content">
      {#each $admin.maintenance as maintenance}
        {#if maintenance.type === MaintenanceType.SQS_MISSING}
          <Layout>
            <Heading>请升级您的安装</Heading>
            <Body>
              我们检测到您使用的Budibase版本取决于在CouchDB数据库的最新版本上已安装。
            </Body>
            <Body>
              要解决此问题，您可以回滚到的早期版本Budibase，或按照迁移指南更新到更高版本CouchDB的版本。
            </Body>
          </Layout>
          <Button
            on:click={() => (window.location = "https://docs.budibase.com")}
            >迁移指南</Button
          >
        {/if}
      {/each}
    </div>
  </div>
</div>

<style>
  .main {
    max-width: 700px;
    margin: auto;
    height: 100vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-l);
  }
  .hero {
    margin: var(--spacing-l);
  }
  .content {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: center;
    gap: var(--spacing-m);
  }

  .inner-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-m);
  }

  @media only screen and (max-width: 600px) {
    .content {
      flex-direction: column;
      align-items: flex-start;
    }
    .main {
      height: auto;
    }
  }
</style>
