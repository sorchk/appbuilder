<script>
  import { Link } from "@budibase/bbui"
</script>

<div class="free-footer">
  
</div>

<style>
  .free-footer {
    min-height: 51px;
    flex: 0 0 auto;
    padding: 16px 20px;
    border-top: 1px solid var(--spectrum-global-color-gray-300);
    background: var(--spectrum-alias-background-color-primary);
    display: flex;
    justify-content: flex-end;
  }
  .free-footer :global(.spectrum-Link) {
    text-decoration: none;
    color: var(--spectrum-global-color-gray-900);
    transition: color 130ms ease-out;
  }
  .free-footer :global(.spectrum-Link):hover {
    color: var(--spectrum-global-color-blue-400);
  }
  span {
    font-weight: bold;
  }
</style>
