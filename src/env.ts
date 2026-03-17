/**
 * Environment configuration for the worker and agents.
 * Optional model/config vars have defaults so they are not required in env.
 */

/** Default values for optional env vars (used when not set in Cloudflare / .dev.vars). */
export const ENV_DEFAULTS = {
  /** OpenAI model for the base agent. */
  OPENAI_BASE_MODEL: "gpt-5-mini",
  /** OpenAI model for the compaction agent. */
  OPENAI_COMPACTION_MODEL: "gpt-5-nano",
  /** Replicate model for texture generation. */
  REPLICATE_TEXTURE_MODEL: "retro-diffusion/rd-plus",
} as const;

export type Env = {
  OPENAI_API_KEY: string;
  REPLICATE_API_TOKEN: string;
  R2_PUBLIC_BASE_URL: string;
  TEXTURE_BUCKET: R2Bucket;

  // Optional: override models (defaults in ENV_DEFAULTS)
  OPENAI_BASE_MODEL?: string;
  OPENAI_COMPACTION_MODEL?: string;
  REPLICATE_TEXTURE_MODEL?: string;
};

/** Resolve optional env with defaults. Use in agents: getModel(env, 'script'). */
export function getOpenAIModel(
  env: Env,
  which: "base" | "compaction" = "base",
): string {
  switch (which) {
    case "base":
      return env.OPENAI_BASE_MODEL ?? ENV_DEFAULTS.OPENAI_BASE_MODEL;
    case "compaction":
      return (
        env.OPENAI_COMPACTION_MODEL ?? ENV_DEFAULTS.OPENAI_COMPACTION_MODEL
      );
    default:
      return ENV_DEFAULTS.OPENAI_BASE_MODEL;
  }
}

export function getReplicateTextureModel(env: Env): string {
  return env.REPLICATE_TEXTURE_MODEL ?? ENV_DEFAULTS.REPLICATE_TEXTURE_MODEL;
}
