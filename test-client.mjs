import { AgentClient } from "agents/client";

const host = "localhost:8787";

const client = new AgentClient({
  agent: "ThinkingAgent",
  name: "player-123",
  host,
  onStateUpdate: (state) => console.log("state:", state),
});

const res = await client.call("execute", [
  {
    craftingGrid: [
      [null, "ner:ruby", null],
      ["ner:ruby", "minecraft:diamond_axe", "ner:ruby"],
      [null, "ner:ruby", null],
    ],
    themePrompt: "Overpowered magical items",
  },
]);

console.log("RPC response:", res);

import { writeFile } from "fs/promises";

await writeFile("output.json", JSON.stringify(res, null, 2), "utf-8");

await client.disconnect?.();
