import { routeAgentRequest } from "agents";

import { ThinkingAgent } from "./agents/agent";
import type { Env } from "./env";

export { ThinkingAgent };

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const agentResponse = await routeAgentRequest(request, env as any);
    if (agentResponse) return agentResponse;

    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return new Response("ok", { status: 200 });
    }

    // Serve R2 objects at /r2/<key> (e.g. /r2/textures/agentdemo/ruby_sword.png)
    if (url.pathname.startsWith("/r2/") && request.method === "GET") {
      const key = decodeURIComponent(url.pathname.slice("/r2/".length));
      if (!key) return new Response("Bad request", { status: 400 });
      const object = await env.TEXTURE_BUCKET.get(key);
      if (!object) return new Response("Not found", { status: 404 });
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("Cache-Control", "public, max-age=31536000");
      return new Response(object.body, { headers, status: 200 });
    }

    return new Response("Not found", { status: 404 });
  },
};
