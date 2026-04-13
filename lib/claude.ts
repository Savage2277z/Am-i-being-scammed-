import Anthropic from "@anthropic-ai/sdk";
import { AnalysisResult } from "./types";
import { SYSTEM_PROMPT } from "./constants";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeMessage(text: string): Promise<AnalysisResult> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: text }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  return JSON.parse(content.text) as AnalysisResult;
}
