/**
 * Converts generateText response messages (ModelMessage format) to session
 * UIMessage format so that tool calls and tool results are preserved when
 * we append to the session. The session only has role 'assistant' (no 'tool'),
 * so we merge each (assistant, tool) pair into one assistant message with
 * tool parts that include the output (state: 'output-available').
 */

type AssistantContentPart =
  | { type: "text"; text: string }
  | { type: "reasoning"; text: string }
  | { type: "tool-call"; toolCallId: string; toolName: string; input: unknown };

type ToolResultPart = {
  type: "tool-result";
  toolCallId: string;
  toolName: string;
  output: unknown;
};

/** Accept SDK response messages (role + content) in a provider-agnostic shape. */
type IncomingMessage =
  | { role: "assistant"; content: string | unknown[] }
  | { role: "tool"; content: unknown[] };

function getAssistantContentParts(msg: IncomingMessage): AssistantContentPart[] {
  if (msg.role !== "assistant") return [];
  const c = msg.content;
  if (typeof c === "string") return [{ type: "text", text: c }];
  return c as AssistantContentPart[];
}

function getToolResultsMap(msg: IncomingMessage): Map<string, ToolResultPart> {
  if (msg.role !== "tool") return new Map();
  const map = new Map<string, ToolResultPart>();
  const arr = msg.content as ToolResultPart[];
  for (const part of arr) {
    if (part && typeof part === "object" && part.type === "tool-result") {
      map.set(part.toolCallId, part);
    }
  }
  return map;
}

export type SessionMessage = {
  id: string;
  role: "user" | "assistant";
  parts: Array<
    | { type: "text"; text: string }
    | { type: "reasoning"; text: string }
    | {
        type: `tool-${string}`;
        toolCallId: string;
        input: unknown;
        state: "output-available";
        output: unknown;
      }
  >;
};

/**
 * Convert response.messages from a generateText result into session messages
 * that include tool calls and their results, so the next turn has full context.
 */
export function responseMessagesToSessionMessages(
  responseMessages: IncomingMessage[],
): SessionMessage[] {
  const out: SessionMessage[] = [];
  for (let i = 0; i < responseMessages.length; i++) {
    const msg = responseMessages[i];
    if (msg.role !== "assistant") continue;

    const contentParts = getAssistantContentParts(msg);
    const nextMsg = responseMessages[i + 1];
    const toolResults =
      nextMsg?.role === "tool" ? getToolResultsMap(nextMsg) : new Map();

    const parts: SessionMessage["parts"] = [];
    for (const part of contentParts) {
      if (part.type === "text" && part.text.trim()) {
        parts.push({ type: "text", text: part.text });
      } else if (part.type === "reasoning" && part.text.trim()) {
        parts.push({ type: "reasoning", text: part.text });
      } else if (part.type === "tool-call") {
        const result = toolResults.get(part.toolCallId);
        parts.push({
          type: `tool-${part.toolName}` as `tool-${string}`,
          toolCallId: part.toolCallId,
          input: part.input,
          state: "output-available",
          output: result?.output ?? { __pending: true },
        });
      }
    }

    if (parts.length > 0) {
      out.push({
        id: `assistant-${crypto.randomUUID()}`,
        role: "assistant",
        parts,
      });
    }
  }
  return out;
}
