export * from "./api"

export const OperatorOptions = {
  Equals: {
    value: "equal",
    label: "等于",
  },
  NotEquals: {
    value: "notEqual",
    label: "不等于",
  },
  Empty: {
    value: "empty",
    label: "是空",
  },
  NotEmpty: {
    value: "notEmpty",
    label: "不是空",
  },
  StartsWith: {
    value: "string",
    label: "以...开始",
  },
  Like: {
    value: "fuzzy",
    label: "模糊匹配",
  },
  MoreThan: {
    value: "rangeLow",
    label: "大于等于",
  },
  LessThan: {
    value: "rangeHigh",
    label: "小于等于",
  },
  Contains: {
    value: "contains",
    label: "包含",
  },
  NotContains: {
    value: "notContains",
    label: "不包含",
  },
  In: {
    value: "oneOf",
    label: "在其中",
  },
  ContainsAny: {
    value: "containsAny",
    label: "包含其中一个",
  },
}

export const SqlNumberTypeRangeMap = {
  integer: {
    max: 2147483647,
    min: -2147483648,
  },
  int: {
    max: 2147483647,
    min: -2147483648,
  },
  smallint: {
    max: 32767,
    min: -32768,
  },
  mediumint: {
    max: 8388607,
    min: -8388608,
  },
}

export enum SocketEvent {
  UserUpdate = "UserUpdate",
  UserDisconnect = "UserDisconnect",
  Heartbeat = "Heartbeat",
}

export enum GridSocketEvent {
  RowChange = "RowChange",
  DatasourceChange = "DatasourceChange",
  SelectDatasource = "SelectDatasource",
  SelectCell = "SelectCell",
}

export enum BuilderSocketEvent {
  SelectApp = "SelectApp",
  TableChange = "TableChange",
  DatasourceChange = "DatasourceChange",
  LockTransfer = "LockTransfer",
  ScreenChange = "ScreenChange",
  AppMetadataChange = "AppMetadataChange",
  SelectResource = "SelectResource",
  AppPublishChange = "AppPublishChange",
  AutomationChange = "AutomationChange",
}

export const SocketSessionTTL = 60
export const ValidQueryNameRegex = /^[^()]*$/
export const ValidColumnNameRegex = /^[_a-zA-Z0-9\s]*$/g
export const ValidSnippetNameRegex = /^[a-z_][a-z0-9_]*$/i

export const REBOOT_CRON = "@reboot"

export const InvalidFileExtensions = [
  "7z",
  "action",
  "apk",
  "app",
  "bat",
  "bin",
  "cab",
  "cmd",
  "com",
  "command",
  "cpl",
  "csh",
  "ex_",
  "exe",
  "gadget",
  "inf1",
  "ins",
  "inx",
  "ipa",
  "isu",
  "job",
  "js",
  "jse",
  "ksh",
  "lnk",
  "msc",
  "msi",
  "msp",
  "mst",
  "osx",
  "out",
  "paf",
  "php",
  "pif",
  "prg",
  "ps1",
  "reg",
  "rgs",
  "run",
  "scr",
  "sct",
  "shb",
  "shs",
  "tar",
  "u3p",
  "vb",
  "vbe",
  "vbs",
  "vbscript",
  "wasm",
  "workflow",
  "ws",
  "wsf",
  "wsh",
  "zip",
]

export enum BpmCorrelationKey {
  ONBOARDING = "budibase:onboarding:correlationkey",
}

export enum BpmInstanceKey {
  ONBOARDING = "budibase:onboarding:instancekey",
}

export enum BpmStatusKey {
  ONBOARDING = "budibase:onboarding:status",
}

export enum BpmStatusValue {
  STARTED = "started",
  COMPLETING_ACCOUNT_INFO = "completing_account_info",
  VERIFYING_EMAIL = "verifying_email",
  COMPLETED = "completed",
}
