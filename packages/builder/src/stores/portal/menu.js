import { derived } from "svelte/store"
import { isEnabled, TENANT_FEATURE_FLAGS } from "helpers/featureFlags"
import { admin } from "./admin"
import { auth } from "./auth"
import { sdk } from "@budibase/shared-core"

export const menu = derived([admin, auth], ([$admin, $auth]) => {
  const user = $auth?.user
  const isAdmin = sdk.users.isAdmin(user)
  const cloud = $admin?.cloud
  // Determine user sub pages
  let userSubPages = [
    {
      title: "用户",
      href: "/builder/portal/users/users",
    },
  ]
  if (isEnabled(TENANT_FEATURE_FLAGS.USER_GROUPS)) {
    userSubPages.push({
      title: "组",
      href: "/builder/portal/users/groups",
    })
  }

  // Pages that all devs and admins can access
  let menu = [
    {
      title: "应用",
      href: "/builder/portal/apps",
    },
  ]
  if (sdk.users.isGlobalBuilder(user)) {
    menu.push({
      title: "用户",
      href: "/builder/portal/users",
      subPages: userSubPages,
    })
    menu.push({
      title: "插件",
      href: "/builder/portal/plugins",
    })
  }

  // Add settings page for admins
  if (isAdmin) {
    let settingsSubPages = [
      {
        title: "认证",
        href: "/builder/portal/settings/auth",
      },
      {
        title: "电子邮箱",
        href: "/builder/portal/settings/email",
      },
      {
        title: "组织",
        href: "/builder/portal/settings/organisation",
      },
      {
        title: "品牌",
        href: "/builder/portal/settings/branding",
      },
      {
        title: "环境",
        href: "/builder/portal/settings/environment",
      },
    ]
    if (!cloud) {
      settingsSubPages.push({
        title: "版本",
        href: "/builder/portal/settings/version",
      })
      settingsSubPages.push({
        title: "诊断",
        href: "/builder/portal/settings/diagnostics",
      })
    }
    menu.push({
      title: "设置",
      href: "/builder/portal/settings",
      subPages: settingsSubPages,
    })
  }

  // Add account page
  if (isEnabled(TENANT_FEATURE_FLAGS.LICENSING)) {
    let accountSubPages = [
      {
        title: "使用",
        href: "/builder/portal/account/usage",
      },
    ]
    if (isAdmin) {
      accountSubPages.push({
        title: "审计日志",
        href: "/builder/portal/account/auditLogs",
      })

      if (!cloud) {
        accountSubPages.push({
          title: "系统日志",
          href: "/builder/portal/account/systemLogs",
        })
      }
    }
    if (cloud && user?.accountPortalAccess) {
      accountSubPages.push({
        title: "升级",
        href: $admin?.accountPortalUrl + "/portal/upgrade",
      })
    } else if (!cloud && isAdmin) {
      accountSubPages.push({
        title: "升级",
        href: "/builder/portal/account/upgrade",
      })
    }
    // add license check here
    if (user?.accountPortalAccess && user.account.stripeCustomerId) {
      accountSubPages.push({
        title: "Billing",
        href: $admin?.accountPortalUrl + "/portal/billing",
      })
    }
    menu.push({
      title: "账户",
      href: "/builder/portal/account",
      subPages: accountSubPages,
    })
  }

  return menu
})
