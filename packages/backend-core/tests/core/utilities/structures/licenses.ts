import {
  Billing,
  Customer,
  Feature,
  License,
  OfflineIdentifier,
  OfflineLicense,
  PlanModel,
  PlanType,
  PriceDuration,
  PurchasedPlan,
  PurchasedPrice,
  Quotas,
  Subscription,
} from "@budibase/types"
import { generator } from "./generator"

export function price(): PurchasedPrice {
  return {
    amount: 10000,
    amountMonthly: 10000,
    currency: "usd",
    duration: PriceDuration.MONTHLY,
    priceId: "price_123",
    dayPasses: undefined,
    isPerUser: true,
  }
}

export const plan = (type: PlanType = PlanType.FREE): PurchasedPlan => {
  return {
    type,
    usesInvoicing: false,
    model: PlanModel.PER_USER,
    price: type !== PlanType.FREE ? price() : undefined,
  }
}

export function quotas(): Quotas {
  return {
    usage: {
      monthly: {
        queries: {
          name: "查询",
          value: 1,
          triggers: [],
        },
        automations: {
          name: "查询",
          value: 1,
          triggers: [],
        },
        dayPasses: {
          name: "查询",
          value: 1,
          triggers: [],
        },
      },
      static: {
        rows: {
          name: "行",
          value: 1,
          triggers: [],
        },
        apps: {
          name: "应用",
          value: 1,
          triggers: [],
        },
        users: {
          name: "用户",
          value: 1,
          triggers: [],
        },
        creators: {
          name: "创建者",
          value: 1,
          triggers: [],
        },
        userGroups: {
          name: "用户组",
          value: 1,
          triggers: [],
        },
        plugins: {
          name: "插件",
          value: 1,
          triggers: [],
        },
      },
    },
    constant: {
      automationLogRetentionDays: {
        name: "自动化日志",
        value: 1,
        triggers: [],
      },
      appBackupRetentionDays: {
        name: "备份",
        value: 1,
        triggers: [],
      },
    },
  }
}

export function billing(
  opts: { customer?: Customer; subscription?: Subscription } = {}
): Billing {
  return {
    customer: opts.customer || customer(),
    subscription: opts.subscription || subscription(),
  }
}

export function customer(): Customer {
  return {
    balance: 0,
    currency: "usd",
  }
}

export function subscription(): Subscription {
  return {
    amount: 10000,
    amounts: {
      user: 10000,
      creator: 0,
    },
    cancelAt: undefined,
    currency: "usd",
    currentPeriodEnd: 0,
    currentPeriodStart: 0,
    downgradeAt: 0,
    duration: PriceDuration.MONTHLY,
    pastDueAt: undefined,
    quantity: 0,
    quantities: {
      user: 0,
      creator: 0,
    },
    status: "active",
  }
}

interface GenerateLicenseOpts {
  quotas?: Quotas
  plan?: PurchasedPlan
  planType?: PlanType
  features?: Feature[]
  billing?: Billing
}

export const license = (opts: GenerateLicenseOpts = {}): License => {
  return {
    features: opts.features || [],
    quotas: opts.quotas || quotas(),
    plan: opts.plan || plan(opts.planType),
    billing: opts.billing || billing(),
  }
}

export function offlineLicense(opts: GenerateLicenseOpts = {}): OfflineLicense {
  const base = license(opts)
  return {
    ...base,
    expireAt: new Date().toISOString(),
    identifier: offlineIdentifier(),
  }
}

export function offlineIdentifier(
  installId: string = generator.guid(),
  tenantId: string = generator.guid()
): OfflineIdentifier {
  return {
    installId,
    tenantId,
  }
}
