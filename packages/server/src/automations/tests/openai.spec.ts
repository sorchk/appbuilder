const setup = require("./utilities")

import environment from "../../environment"
import openai from "openai"

jest.mock(
  "openai",
  jest.fn(() => ({
    Configuration: jest.fn(),
    OpenAIApi: jest.fn(() => ({
      createChatCompletion: jest.fn(() => ({
        data: {
          choices: [
            {
              message: {
                content: "This is a test",
              },
            },
          ],
        },
      })),
    })),
  }))
)

const mockedOpenAIApi = openai.OpenAIApi as jest.MockedClass<
  typeof openai.OpenAIApi
>

const OPENAI_PROMPT = "生命的意义是什么？"

describe("测试openai操作", () => {
  let config = setup.getConfig()

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(() => {
    environment.OPENAI_API_KEY = "abc123"
  })

  afterAll(setup.afterAll)

  it("应在未设置OPENAI_API_KEY变量时显示正确的错误消息", async () => {
    delete environment.OPENAI_API_KEY

    let res = await setup.runStep("OPENAI", {
      prompt: OPENAI_PROMPT,
    })
    expect(res.response).toEqual(
      "未配置OpenAI API密钥-请添加OpenAI_API_Key环境变量。"
    )
    expect(res.success).toBeFalsy()
  })

  it("应该能够在给定提示的情况下从ChatGPT接收响应", async () => {
    const res = await setup.runStep("OPENAI", {
      prompt: OPENAI_PROMPT,
    })
    expect(res.response).toEqual("这是一个测试")
    expect(res.success).toBeTruthy()
  })

  it("应在未提供提示时显示正确的错误消息", async () => {
    const res = await setup.runStep("OPENAI", {
      prompt: null,
    })
    expect(res.response).toEqual(
      "OpenAI自动化失败：未提供提示"
    )
    expect(res.success).toBeFalsy()
  })

  it("当从createChatCompletion调用引发错误时，应显示正确的错误消息", async () => {
    mockedOpenAIApi.mockImplementation(
      () =>
        ({
          createChatCompletion: jest.fn(() => {
            throw new Error(
              "调用createChatCompletion时出错"
            )
          }),
        } as any)
    )

    const res = await setup.runStep("OPENAI", {
      prompt: OPENAI_PROMPT,
    })

    expect(res.response).toEqual(
      "错误: 调用createChatCompletion时出错"
    )
    expect(res.success).toBeFalsy()
  })
})
