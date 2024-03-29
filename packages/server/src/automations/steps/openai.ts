import { Configuration, OpenAIApi } from "openai"
import {
  AutomationActionStepId,
  AutomationStepSchema,
  AutomationStepInput,
  AutomationStepType,
  AutomationIOType,
} from "@budibase/types"
import * as automationUtils from "../automationUtils"
import environment from "../../environment"

enum Model {
  GPT_35_TURBO = "gpt-3.5-turbo",
  // will only work with api keys that have access to the GPT4 API
  GPT_4 = "gpt-4",
}

export const definition: AutomationStepSchema = {
  name: "OpenAI",
  tagline: "Send prompts to ChatGPT",
  icon: "Algorithm",
  description: "Interact with the OpenAI ChatGPT API.",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {},
  stepId: AutomationActionStepId.OPENAI,
  inputs: {
    prompt: "",
  },
  schema: {
    inputs: {
      properties: {
        prompt: {
          type: AutomationIOType.STRING,
          title: "Prompt",
        },
        model: {
          type: AutomationIOType.STRING,
          title: "Model",
          enum: Object.values(Model),
        },
      },
      required: ["prompt", "model"],
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the action was successful",
        },
        response: {
          type: AutomationIOType.STRING,
          description: "What was output",
        },
      },
      required: ["success", "response"],
    },
  },
}

export async function run({ inputs }: AutomationStepInput) {
  if (!environment.OPENAI_API_KEY) {
    return {
      success: false,
      response:
        "未配置OpenAI API密钥-请添加OpenAI_API_Key环境变量。",
    }
  }

  if (inputs.prompt == null) {
    return {
      success: false,
      response: "OpenAI自动化失败：未提供提示",
    }
  }

  try {
    const configuration = new Configuration({
      apiKey: environment.OPENAI_API_KEY,
    })

    const openai = new OpenAIApi(configuration)

    const completion = await openai.createChatCompletion({
      model: inputs.model,
      messages: [
        {
          role: "user",
          content: inputs.prompt,
        },
      ],
    })

    const response = completion?.data?.choices[0]?.message?.content

    return {
      response,
      success: true,
    }
  } catch (err) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
