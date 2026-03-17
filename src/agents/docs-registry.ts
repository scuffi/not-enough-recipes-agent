/**
 * Registry of documentation files under src/agents/docs.
 * Contents are imported at build time so they are available in the Worker.
 */

import scriptingGuide from "./docs/SCRIPTING_GUIDE.md";
import contentGuide from "./docs/CONTENT_GUIDE.md";
import contentSchema from "./docs/CONTENT_SCHEMA.json";

const DOCS: Record<string, string> = {
  "SCRIPTING_GUIDE.md": scriptingGuide,
  "CONTENT_GUIDE.md": contentGuide,
  "CONTENT_SCHEMA.json": JSON.stringify(contentSchema, null, 2),
};

export const DOC_NAMES: string[] = Object.keys(DOCS).sort();

export function getDocContent(filename: string): string | null {
  const normalized = filename.trim();
  if (DOCS[normalized] !== undefined) {
    return DOCS[normalized];
  }
  // Allow passing just the base name without path
  const base = normalized.replace(/^.*\//, "");
  return DOCS[base] ?? null;
}
