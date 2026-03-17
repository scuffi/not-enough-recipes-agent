import { z } from "zod";
import { tool } from "ai";
import Replicate from "replicate";
import * as acorn from "acorn";
import { Env, getReplicateTextureModel } from "../env";
import { DOC_NAMES, getDocContent } from "./docs-registry";

export const getTools = (env: Env) => {
  return {
    validateJavaScript: tool({
      description:
        "Validate a JavaScript code string. Returns any syntax or parse errors in plain English so the LLM can fix them.",
      inputSchema: z.object({
        code: z.string().describe("The JavaScript source code to validate"),
      }),
      execute: async ({ code }) => {
        console.log("[TOOL] validateJavaScript", code);
        try {
          acorn.parse(code, {
            ecmaVersion: 2020,
            sourceType: "script",
            allowReturnOutsideFunction: false,
          });
          return { valid: true, issues: [] };
        } catch (e: unknown) {
          const err = e as {
            message?: string;
            pos?: number;
            loc?: { line: number; column: number };
          };
          const message = err.message ?? String(e);
          const loc = err.loc;
          const lineInfo =
            loc != null
              ? ` at line ${loc.line}, column ${loc.column}`
              : err.pos != null
                ? ` near position ${err.pos}`
                : "";
          const issue = `Syntax error${lineInfo}: ${message}`;
          return { valid: false, issues: [issue] };
        }
      },
    }),
    generateTexture: tool({
      description: "Generate a 16x16 pixel Minecraft texture",
      inputSchema: z.object({
        texturePrompt: z
          .string()
          .describe(
            "The concise, single sentence texture prompt, not complex or overly detailed, should be a simple description of the texture. e.g. 'A ruby-infused diamond axe with a ruby on the handle'",
          ),
        style: z
          .enum(["block", "item"])
          .describe("The style of the texture to generate"),
      }),
      execute: async ({ texturePrompt, style }) => {
        console.log("[TOOL] generateTexture", texturePrompt, style);
        const texture = await generateTexture(env, {
          uid: crypto.randomUUID().replace(/-/g, "").slice(0, 12),
          texturePrompt,
          style,
        });
        return texture;
      },
    }),
    listDocumentation: tool({
      description:
        "List the names of all documentation files available under src/agents/docs. Use this to see what files you can read with readDocumentation.",
      inputSchema: z.object({}),
      execute: async () => {
        console.log("[TOOL] listDocumentation");
        return { files: DOC_NAMES };
      },
    }),
    readDocumentation: tool({
      description:
        "Read the contents of a documentation file from src/agents/docs. Pass the file name (e.g. SCRIPTING_GUIDE.md or CONTENT_SCHEMA.json). Use listDocumentation first to see available files.",
      inputSchema: z.object({
        fileName: z
          .string()
          .describe(
            "The documentation file name to read (e.g. SCRIPTING_GUIDE.md, CONTENT_GUIDE.md, CONTENT_SCHEMA.json)",
          ),
      }),
      execute: async ({ fileName }) => {
        console.log("[TOOL] readDocumentation", fileName);
        const content = getDocContent(fileName);
        if (content === null) {
          return {
            found: false,
            error: `No such documentation file: ${fileName}. Use listDocumentation to see available files.`,
          };
        }
        return { found: true, content };
      },
    }),
  };
};

async function generateTexture(
  env: Env,
  {
    uid,
    texturePrompt,
    style,
  }: {
    uid: string;
    texturePrompt: string;
    style: "block" | "item";
  },
) {
  const replicate = new Replicate({
    auth: env.REPLICATE_API_TOKEN,
  });

  const input = {
    style: style == "block" ? "mc_texture" : "mc_item",
    width: 16,
    height: 16,
    prompt: texturePrompt,
    tile_x: false,
    tile_y: false,
    strength: 0.8,
    remove_bg: true,
    num_images: 1,
    bypass_prompt_expansion: false,
  };

  const modelId = getReplicateTextureModel(env) as `${string}/${string}`;
  const output = (await replicate.run(modelId, {
    input,
  })) as { url?: () => string }[];

  const imageUrl =
    typeof output[0]?.url === "function"
      ? output[0].url()
      : (output[0] as unknown as string);
  if (!imageUrl) {
    console.error("Replicate did not return an image URL", output);
    throw new Error("Replicate did not return an image URL");
  }

  const imageRes = await fetch(imageUrl);
  if (!imageRes.ok) {
    console.error("Failed to download image from Replicate", imageRes);
    throw new Error(
      `Failed to download image from Replicate: ${imageRes.status}`,
    );
  }
  const imageBytes = await imageRes.arrayBuffer();

  const r2Key = `textures/${uid}.png`;
  await env.TEXTURE_BUCKET.put(r2Key, imageBytes, {
    httpMetadata: {
      contentType: imageRes.headers.get("content-type") || "image/png",
    },
  });

  const base = env.R2_PUBLIC_BASE_URL.replace(/\/$/, "");
  const publicUrl = `${base}/r2/${r2Key}`;
  const path = `textures/${uid}`;

  console.log(
    "Generated texture with path:",
    path,
    "and public URL:",
    publicUrl,
  );

  return { path, publicUrl };
}
