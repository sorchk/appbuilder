/**
 * Operator options for lucene queries
 */
export { OperatorOptions, SqlNumberTypeRangeMap } from "@budibase/shared-core"
export { Feature as Features } from "@budibase/types"
import { BpmCorrelationKey } from "@budibase/shared-core"

// Cookie names
export const Cookies = {
  Auth: "budibase:auth",
  CurrentApp: "budibase:currentapp",
  ReturnUrl: "budibase:returnurl",
  AccountReturnUrl: "budibase:account:returnurl",
  OnboardingProcessCorrelationKey: BpmCorrelationKey.ONBOARDING,
}

// Table names
export const TableNames = {
  USERS: "ta_users",
}

export const BudibaseRoles = {
  AppUser: "appUser",
  Developer: "developer",
  Creator: "creator",
  Admin: "admin",
}

export const BudibaseRoleOptionsOld = [
  {
    label: "开发者",
    value: BudibaseRoles.Developer,
  },
]
export const BudibaseRoleOptions = [
  {
    label: "管理员",
    value: BudibaseRoles.Admin,
    subtitle: "可以完全访问您帐户中的所有应用程序和设置",
  },
  {
    label: "创建者",
    value: BudibaseRoles.Creator,
    subtitle: "可以创建和编辑他们有权访问的应用程序",
  },
  {
    label: "应用用户",
    value: BudibaseRoles.AppUser,
    subtitle: "只能使用他们有权访问的已发布应用程序",
  },
]

export const PlanType = {
  FREE: "free",
  TEAM: "team",
  PRO: "pro",
  BUSINESS: "business",
  ENTERPRISE: "enterprise",
}

/**
 * API version header attached to all requests.
 * Version changelog:
 * v1:
 *   - Coerce types for search endpoint
 */
export const ApiVersion = "1"

// Role IDs
export const Roles = {
  ADMIN: "ADMIN",
  POWER: "POWER",
  BASIC: "BASIC",
  PUBLIC: "PUBLIC",
  BUILDER: "BUILDER",
  CREATOR: "CREATOR",
}

export const Themes = [
  {
    class: "lightest",
    name: "最明亮的",
  },
  {
    class: "light",
    name: "明亮的",
  },
  {
    class: "dark",
    name: "黑暗的",
  },
  {
    class: "darkest",
    name: "最黑暗的",
  },
  {
    class: "nord",
    name: "Nord",
    base: "darkest",
  },
  {
    class: "midnight",
    name: "物业",
    base: "darkest",
  },
]

export const EventPublishType = {
  ENV_VAR_UPGRADE_PANEL_OPENED: "environment_variable_upgrade_panel_opened",
}

export const ContextScopes = {
  Local: "local",
  Global: "global",
}
