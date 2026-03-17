# Not Enough Recipes — Agent API

The **agent backend** for [Not Enough Recipes](https://github.com/scuffi/not-enough-recipes-mod): an AI service that turns Creation Altar recipes into new items, blocks, textures, and scripts. This repo is the “brain” that the Minecraft mod talks to when you use the altar — it’s not meant to be run or deployed by players, but as the server-side counterpart that powers agent-based infinite crafting.

## Overview

[Not Enough Recipes (the mod)](https://github.com/scuffi/not-enough-recipes-mod) adds a **Creation Altar** in-game: players fill a 3×3 grid and give a theme, and the game asks an external API to invent new content. **This project is that API.** It runs as a Cloudflare Worker with a Durable Object agent that:

- Takes a **crafting grid** (item IDs in a 3×3 layout) and a **theme prompt**
- Uses an LLM to plan and generate an **item/block definition** that fits Minecraft’s style and the mod’s schema
- Generates a **16×16 texture** (via Replicate) and stores it in R2, returning a public URL
- Optionally produces a **JavaScript event script** for custom behaviour, validated for syntax
- Returns everything the mod needs to register the new item/block at runtime (no restart)

So: **mod = in-game UI and runtime registration; this repo = the agent that decides what to create and produces the assets and definitions.** Together they form the agent-based infinite crafting system.

## How the two link together

```
┌─────────────────────────────────────┐     crafting grid      ┌─────────────────────────────────────┐
│  Not Enough Recipes (Fabric mod)    │  + theme prompt   ───► │  This Agent API (Cloudflare Worker) │
│  • Creation Altar 3×3 GUI           │                        │  • ThinkingAgent (Durable Object)   │
│  • Sends recipe to agent API        │                        │  • LLM + tools (texture, docs, JS)  │
│  • Dynamic registry, resources,     │  ◄───  item def        │  • R2 textures, Replicate, OpenAI    │
│    scripts                          │  + texture URL         │                                     │
│                                     │  + optional script     │                                     │
└─────────────────────────────────────┘                        └─────────────────────────────────────┘
```

The mod calls the agent’s `execute` RPC with `craftingGrid` and `themePrompt`; the agent returns `itemDefinition` (JSON), `texturePath` (URL), and optionally `scriptString`. The mod then registers the item/block, pulls the texture from that URL (or from a configured resource path), and installs the script in its JavaScript runtime. No game restart — the new content appears in-world.

---

## Showcase

<!-- TODO: Add a short video here demonstrating the agent + mod together (e.g. using the Creation Altar and the resulting new item in-game). -->

*Space reserved for a video walkthrough of the agent and mod working together.*

---

## What this project does (in more detail)

- **ThinkingAgent**  
  A single agent (per session) that runs a multi-step loop: read docs (content schema, scripting guide), generate a texture, optionally write and validate a script, then output a structured result (texture URL, item/block JSON, script string).

- **Tools**  
  - `generateTexture`: 16×16 Minecraft-style texture via Replicate, uploaded to R2; returns a public URL.  
  - `validateJavaScript`: Acorn parse of the script so the model can fix syntax before declaring done.  
  - `listDocumentation` / `readDocumentation`: Read from bundled docs (e.g. `CONTENT_SCHEMA.json`, `SCRIPTING_GUIDE.md`, `CONTENT_GUIDE.md`) so the model stays within the mod’s expected formats.

- **Output**  
  The agent’s final step returns: `texturePath` (R2 URL), `itemDefinition` (JSON for the mod’s registry), `scriptString` (optional), and `itemSummary` (short description). The worker also serves R2 objects at `/r2/<key>` so the mod (or a resource pack) can fetch textures from the same host.

- **Stack**  
  TypeScript, Vercel AI SDK, `agents` (routing + session), Cloudflare Workers + Durable Objects, R2, OpenAI, Replicate. Designed to be deployed as the server side of the Not Enough Recipes system; the mod is the client.

## Repo structure (high level)

- `src/index.ts` — Worker entry: agent routing, `/health`, `/r2/<key>` texture serving.  
- `src/agents/agent.ts` — `ThinkingAgent` and the execute loop (session, tools, structured output).  
- `src/agents/tools.ts` — Tool definitions (texture generation, JS validation, docs).  
- `src/agents/docs/` — Bundled markdown/JSON the agent reads (content schema, scripting guide, etc.).  
- `wrangler.toml` — Worker config (R2 bucket, Durable Object, env).

## Not for direct use

This codebase is the **backend** for the Not Enough Recipes mod. End users are expected to play with the mod; they don’t run or deploy this service themselves. If you’re hacking on agent-based crafting or the mod, this repo is the reference implementation of the agent API the mod expects.

## License

MIT.
