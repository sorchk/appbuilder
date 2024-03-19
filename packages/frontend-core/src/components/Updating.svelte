<script>
  export let isMigrationDone
  export let onMigrationDone
  export let timeoutSeconds = 10 // 3 minutes

  const loadTime = Date.now()
  let timedOut = false

  async function checkMigrationsFinished() {
    setTimeout(async () => {
      const isMigrated = await isMigrationDone()

      const timeoutMs = timeoutSeconds * 1000
      if (!isMigrated) {
        if (loadTime + timeoutMs > Date.now()) {
          return checkMigrationsFinished()
        }

        return migrationTimeout()
      }

      onMigrationDone()
    }, 1000)
  }

  checkMigrationsFinished()

  function migrationTimeout() {
    timedOut = true
  }
</script>

<div class="loading" class:timeout={timedOut}>
  <span class="header">
    {#if !timedOut}
      System update
    {:else}
      Something went wrong!
    {/if}
  </span>
  <span class="subtext">
    {#if !timedOut}
    请稍候，我们马上回来！
    {:else}
    出现错误，请稍后再试。
      <br />
      如果问题依然存在。
      联系<a href="https://budibase.com/support/" target="_blank">支持</a> 
    {/if}</span
  >
</div>

<style>
  .loading {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: var(--spacing-l);
    height: 100vh;
    text-align: center;
    font-size: 18px;
  }
  .header {
    font-weight: 700;
  }
  .timeout .header {
    color: rgb(196, 46, 46);
  }
  .subtext {
    font-size: 16px;
    color: var(--grey-7);
  }

  .subtext a {
    color: var(--grey-7);
    font-weight: 700;
  }
</style>
