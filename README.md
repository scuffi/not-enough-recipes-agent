# Not Enough Recipes — Agent API 🧙‍♂️✨

The **brain** behind [Not Enough Recipes](https://github.com/scuffi/not-enough-recipes-mod)! This is the AI service that turns your Creation Altar recipes into new items, blocks, pixel art textures, and even little JavaScript scripts — all without restarting the game.

**The mod** = the altar in Minecraft where you slap stuff in a 3×3 grid + a theme. **This repo** = the agent (Cloudflare Worker + LLM) that dreams up the new content and ships back item definitions, textures (via Replicate → R2), and optional event scripts. Players use the mod; this is the backend that makes the magic happen. 🪄

```
🎮 Mod (Creation Altar)  ──►  crafting grid + theme  ──►  🤖 This API (ThinkingAgent)
                                                              │
    new item in your hand  ◄──  item def + texture + script  ◄─┘
```

---

## 🎬 Showcase

<!-- TODO: Add a short video here — e.g. using the Creation Altar and the new item in-game! -->

_Video spot reserved for agent + mod in action._

---

## 🔧 The gist

One **ThinkingAgent** (Durable Object) that takes your grid + prompt, uses tools to generate textures, validate JS, and read the content docs, then spits out everything the mod needs. Not meant for end users to run — just the server side that the mod calls. If you're poking at agent-based crafting or the mod itself, this is the reference. 📦

**License:** MIT.
