import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";
import { Agent, callable } from "agents";
import {
  Session,
  AgentSessionProvider,
} from "agents/experimental/memory/session";
import {
  convertToModelMessages,
  generateText,
  LanguageModel,
  Output,
  stepCountIs,
} from "ai";
import { Env, getOpenAIModel } from "../env";
import { getTools } from "./tools";
import { compactMessages } from "./compaction";
import { getSystemPrompt } from "../prompts";
import { craftingGridToPipeString } from "../utils";
import { responseMessagesToSessionMessages } from "./response-to-session-messages";

/** Schema for one step of the agent loop: thinking + completion flag + final outputs (use "" when not completed) */
export const AgentStepOutputSchema = z.object({
  thinking: z
    .string()
    .describe(
      "Your current reasoning: what you've done, what you observed from tools, and what you plan to do next or have finished.",
    ),
  completed: z
    .boolean()
    .describe(
      "True only when all steps are done and you are ready to return texture path, item definition, and script. Otherwise false.",
    ),
  texturePath: z
    .string()
    .describe(
      "When completed is true: the texture public facing URL (e.g. http://localhost:8787/r2/textures/44f3378a0c9e.png). When not completed use empty string.",
    ),
  itemDefinition: z
    .string()
    .describe(
      'When completed is true: JSON object string of the item or block definition (e.g. {"id": "ner:ruby_sword", "components": [...]}). When not completed use empty string.',
    ),
  scriptString: z
    .string()
    .describe(
      "When completed is true: the final JavaScript script string. When not completed use empty string.",
    ),
  itemSummary: z
    .string()
    .describe(
      "When completed is true: a short summary of the item or block definition for the user to understand what you have generated. When not completed use empty string.",
    ),
  itemType: z
    .enum(["item", "block"])
    .describe(
      "When completed is true: the type of generated content, either an item or a block. When not completed use 'item' as default.",
    ),
});

export const stepOutputSpec = Output.object({
  schema: AgentStepOutputSchema,
  name: "AgentStepOutput",
  description:
    "Your step output: thinking (reasoning), completed (true only when done), and when completed also texturePath, itemDefinition, scriptString.",
});

/** Raw step output from the model (itemDefinition is JSON string) */
type AgentStepOutputRaw = z.infer<typeof AgentStepOutputSchema>;

/** Public type: itemDefinition is parsed from JSON string in the schema output */
export type AgentStepOutput = {
  thinking: string;
  completed: boolean;
  texturePath?: string;
  itemDefinition?: Record<string, unknown>;
  scriptString?: string;
  itemSummary?: string;
  itemType?: "item" | "block";
};

const DEFAULT_MAX_STEPS_PER_TURN = 20;

export class ThinkingAgent extends Agent<Env> {
  // microCompaction is enabled by default — truncates tool outputs
  // and long text in older messages on every append()
  session = new Session(new AgentSessionProvider(this), {
    compaction: {
      tokenThreshold: 25000,
      fn: (msgs) => compactMessages(msgs, this.env),
    },
  });

  @callable()
  async execute({
    craftingGrid,
    themePrompt,
  }: {
    craftingGrid: string[][];
    themePrompt: string;
  }): Promise<AgentStepOutput> {
    /** Create the OpenAI model (can switch this out for openrouter maybe?) */
    const openai = createOpenAI({ apiKey: this.env.OPENAI_API_KEY });
    const model = openai(getOpenAIModel(this.env, "base"));

    const craftingGridString = craftingGridToPipeString(craftingGrid);

    // Clear the session messages so we can start fresh
    this.session.clearMessages();

    await this.session.append({
      id: `user-${crypto.randomUUID()}`,
      role: "user",
      parts: [
        {
          type: "text",
          text: `Crafting grid:\n${craftingGridString}\n\nTheme prompt: ${themePrompt}`,
        },
      ],
    });

    for (let maxSteps = 0; maxSteps < DEFAULT_MAX_STEPS_PER_TURN; maxSteps++) {
      // TODO: Implement ability for agent to reject the recipe, store this and check first
      const result = await this.runAgentLoop(
        model,
        craftingGridString,
        themePrompt,
      );
      if (result.completed) {
        if (!result.texturePath?.trim() || !result.itemDefinition?.trim()) {
          await this.session.append({
            id: `validator-${crypto.randomUUID()}`,
            role: "user",
            parts: [
              {
                type: "text",
                text: `Agent completed but missing texturePath, or itemDefinition. ${JSON.stringify(result)}`,
              },
            ],
          });
        } else {
          // Agent is completed, return result (parse itemDefinition from JSON string)
          const texturePath = result.texturePath?.trim() || undefined;
          const scriptString = result.scriptString?.trim() || undefined;
          const itemDefinition =
            result.itemDefinition?.trim() !== ""
              ? (JSON.parse(result.itemDefinition!) as Record<string, unknown>)
              : undefined;
          return {
            thinking: result.thinking,
            completed: result.completed,
            texturePath,
            scriptString,
            itemDefinition,
            itemSummary: result.itemSummary,
            itemType: result.itemType,
          };
        }
      }
    }

    throw new Error("Agent did not complete within max steps.");
  }

  private async runAgentLoop(
    model: LanguageModel,
    craftingGridString: string,
    themePrompt: string,
  ): Promise<AgentStepOutputRaw> {
    const result = await generateText({
      model,
      system: getSystemPrompt(craftingGridString, themePrompt),
      messages: await convertToModelMessages(this.session.getMessages()),
      output: stepOutputSpec,
      tools: getTools(this.env),
      stopWhen: stepCountIs(5),
    });
    console.log("Tool calls:", result.toolCalls);
    console.log("Text:", result.text);

    // Append full response (assistant + tool calls + tool results) so the next
    // turn has full context and the model can be iterative.
    const sessionMessages = responseMessagesToSessionMessages(
      result.response.messages as Array<
        | { role: "assistant"; content: string | unknown[] }
        | { role: "tool"; content: unknown[] }
      >,
    );
    for (const msg of sessionMessages) {
      await this.session.append(msg);
    }

    // When the last step did not finish with "stop", the SDK does not parse
    // structured output and result.output getter throws NoOutputGeneratedError.
    // Treat as not completed so the outer loop continues (next turn will see
    // tool results and can complete).
    if (result.finishReason !== "stop") {
      return {
        thinking: result.text ?? "",
        completed: false,
        texturePath: "",
        itemDefinition: "",
        scriptString: "",
        itemSummary: "",
        itemType: "item",
      };
    }
    return result.output;
  }
}
