import { get } from "svelte/store"
import { builderStore } from "stores/builder"
import { auth } from "stores/portal"
import analytics from "analytics"
import {
  OnboardingData,
  OnboardingDesign,
  OnboardingPublish,
  NewViewUpdateFormRowId,
  NewFormSteps,
} from "./steps"
import { API } from "api"
import { customPositionHandler } from "components/design/settings/controls/EditComponentPopover"

const ONBOARDING_EVENT_PREFIX = "onboarding"

export const TOUR_STEP_KEYS = {
  BUILDER_APP_PUBLISH: "builder-app-publish",
  BUILDER_DATA_SECTION: "builder-data-section",
  BUILDER_DESIGN_SECTION: "builder-design-section",
  BUILDER_USER_MANAGEMENT: "builder-user-management",
  BUILDER_AUTOMATION_SECTION: "builder-automation-section",
  FEATURE_USER_MANAGEMENT: "feature-user-management",
  BUILDER_FORM_CREATE_STEPS: "builder-form-create-steps",
  BUILDER_FORM_VIEW_UPDATE_STEPS: "builder-form-view-update-steps",
  BUILDER_FORM_ROW_ID: "builder-form-row-id",
}

export const TOUR_KEYS = {
  TOUR_BUILDER_ONBOARDING: "builder-onboarding",
  FEATURE_ONBOARDING: "feature-onboarding",
  BUILDER_FORM_CREATE: "builder-form-create",
  BUILDER_FORM_VIEW_UPDATE: "builder-form-view-update",
}

export const getCurrentStepIdx = (steps, tourStepKey) => {
  if (!steps?.length) {
    return
  }
  if (steps?.length && !tourStepKey) {
    return 0
  }
  return steps.findIndex(step => step.id === tourStepKey)
}

const endUserOnboarding = async ({ skipped = false } = {}) => {
  // Mark the users onboarding as complete
  // Clear all tour related state
  if (get(auth).user) {
    try {
      await API.updateSelf({
        onboardedAt: new Date().toISOString(),
      })

      if (skipped) {
        tourEvent("skipped")
      }

      // Update the cached user
      await auth.getSelf()

      builderStore.endBuilderOnboarding()
      builderStore.setTour()
    } catch (e) {
      console.error("Onboarding failed", e)
      return false
    }
    return true
  }
}

const endTour = async ({ key, skipped = false } = {}) => {
  const { tours = {} } = get(auth).user
  tours[key] = new Date().toISOString()

  await API.updateSelf({
    tours,
  })

  if (skipped) {
    tourEvent(key, skipped)
  }

  // Update the cached user
  await auth.getSelf()

  // Reset tour state
  builderStore.setTour()
}

const tourEvent = (eventKey, skipped) => {
  analytics.captureEvent(`${ONBOARDING_EVENT_PREFIX}:${eventKey}`, {
    eventSource: EventSource.PORTAL,
    skipped,
  })
}

const getTours = () => {
  return {
    [TOUR_KEYS.TOUR_BUILDER_ONBOARDING]: {
      steps: [
        {
          id: TOUR_STEP_KEYS.BUILDER_DATA_SECTION,
          title: "数据",
          route: "/builder/app/:application/data",
          layout: OnboardingData,
          query: ".topleftnav .spectrum-Tabs-item#builder-data-tab",
          onLoad: async () => {
            tourEvent(TOUR_STEP_KEYS.BUILDER_DATA_SECTION)
          },
          align: "left",
        },
        {
          id: TOUR_STEP_KEYS.BUILDER_DESIGN_SECTION,
          title: "设计",
          route: "/builder/app/:application/design",
          layout: OnboardingDesign,
          query: ".topleftnav .spectrum-Tabs-item#builder-design-tab",
          onLoad: () => {
            tourEvent(TOUR_STEP_KEYS.BUILDER_DESIGN_SECTION)
          },
          align: "left",
        },
        {
          id: TOUR_STEP_KEYS.BUILDER_AUTOMATION_SECTION,
          title: "自动化",
          route: "/builder/app/:application/automation",
          query: ".topleftnav .spectrum-Tabs-item#builder-automation-tab",
          body: "一旦你制作了应用程序屏幕，你就可以设置自动化功能以适应当前的工作流程",
          onLoad: () => {
            tourEvent(TOUR_STEP_KEYS.BUILDER_AUTOMATION_SECTION)
          },
          align: "left",
        },
        {
          id: TOUR_STEP_KEYS.BUILDER_USER_MANAGEMENT,
          title: "用户",
          query: ".toprightnav #builder-app-users-button",
          body: "将用户添加到您的应用程序并控制他们的访问级别。",
          onLoad: () => {
            tourEvent(TOUR_STEP_KEYS.BUILDER_USER_MANAGEMENT)
          },
        },
        {
          id: TOUR_STEP_KEYS.BUILDER_APP_PUBLISH,
          title: "发布",
          layout: OnboardingPublish,
          route: "/builder/app/:application/design",
          query: ".toprightnav #builder-app-publish-button",
          onLoad: () => {
            tourEvent(TOUR_STEP_KEYS.BUILDER_APP_PUBLISH)
          },
          onComplete: endUserOnboarding,
        },
      ],
      onSkip: async () => {
        await endUserOnboarding({ skipped: true })
      },
      endRoute: "/builder/app/:application/data",
    },
    [TOUR_KEYS.FEATURE_ONBOARDING]: {
      steps: [
        {
          id: TOUR_STEP_KEYS.FEATURE_USER_MANAGEMENT,
          title: "用户",
          query: ".toprightnav #builder-app-users-button",
          body: "将用户添加到您的应用程序并控制他们的访问级别。",
          onLoad: () => {
            tourEvent(TOUR_STEP_KEYS.FEATURE_USER_MANAGEMENT)
          },
          onComplete: endUserOnboarding,
        },
      ],
    },
    [TOUR_KEYS.BUILDER_FORM_CREATE]: {
      steps: [
        {
          id: TOUR_STEP_KEYS.BUILDER_FORM_CREATE_STEPS,
          title: "添加多个步骤",
          layout: NewFormSteps,
          query: "#steps-prop-control-wrap",
          onComplete: () => {
            builderStore.highlightSetting()
            endTour({ key: TOUR_KEYS.BUILDER_FORM_CREATE })
          },
          onLoad: () => {
            tourEvent(TOUR_STEP_KEYS.BUILDER_FORM_CREATE_STEPS)
            builderStore.highlightSetting("steps", "info")
          },
          positionHandler: customPositionHandler,
          align: "left-outside",
        },
      ],
    },
    [TOUR_KEYS.BUILDER_FORM_VIEW_UPDATE]: {
      steps: [
        {
          id: TOUR_STEP_KEYS.BUILDER_FORM_ROW_ID,
          title: "添加行ID以更新行",
          layout: NewViewUpdateFormRowId,
          query: "#rowId-prop-control-wrap",
          onLoad: () => {
            tourEvent(TOUR_STEP_KEYS.BUILDER_FORM_ROW_ID)
            builderStore.highlightSetting("rowId", "info")
          },
          positionHandler: customPositionHandler,
          align: "left-outside",
        },
        {
          id: TOUR_STEP_KEYS.BUILDER_FORM_VIEW_UPDATE_STEPS,
          title: "添加多个步骤",
          layout: NewFormSteps,
          query: "#steps-prop-control-wrap",
          onComplete: () => {
            builderStore.highlightSetting()
            endTour({ key: TOUR_KEYS.BUILDER_FORM_VIEW_UPDATE })
          },
          onLoad: () => {
            tourEvent(TOUR_STEP_KEYS.BUILDER_FORM_VIEW_UPDATE_STEPS)
            builderStore.highlightSetting("steps", "info")
          },
          positionHandler: customPositionHandler,
          align: "left-outside",
          scrollIntoView: true,
        },
      ],
      onSkip: async () => {
        builderStore.highlightSetting()
        endTour({ key: TOUR_KEYS.BUILDER_FORM_VIEW_UPDATE, skipped: true })
      },
    },
  }
}

export const TOURS = getTours()
export const TOURSBYSTEP = Object.keys(TOURS).reduce((acc, tour) => {
  TOURS[tour].steps.forEach(element => {
    acc[element.id] = element
    acc[element.id]["tour"] = tour
  })
  return acc
}, {})
