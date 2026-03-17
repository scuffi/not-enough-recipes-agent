import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, generateText, UIMessage } from "ai";
import { Env, getOpenAIModel } from "../env";

export async function compactMessages(
  messages: UIMessage[],
  env: Env,
): Promise<UIMessage[]> {
  if (messages.length === 0) return [];

  const openai = createOpenAI({ apiKey: env.OPENAI_API_KEY });
  const model = openai(getOpenAIModel(env, "compaction"));
  const { text } = await generateText({
    model,
    system:
      "Summarize this conversation concisely, preserving key decisions, facts, and context.",
    messages: await convertToModelMessages(messages),
  });

  return [
    {
      id: `summary-${crypto.randomUUID()}`,
      role: "assistant",
      parts: [{ type: "text", text: `[Conversation Summary]\n${text}` }],
    },
  ];
}
