<script>
  import { roles } from "stores/builder"

  export let value

  $: role = $roles.find(role => role._id === value)
  $: roleName = role?.name ?? "未知角色"
</script>

{roleName}
