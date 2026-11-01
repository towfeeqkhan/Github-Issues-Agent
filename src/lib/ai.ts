import { createOpenAI } from "@ai-sdk/openai";

export const tokenHarbor = createOpenAI({
  baseURL: "https://tokenharbor.ai/v1",
  apiKey: process.env.TOKENHARBOR_API_KEY,
});

export const model = tokenHarbor("gpt-6-luna");
