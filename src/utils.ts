type CraftCell = string | null;
type CraftGrid = CraftCell[][];

/**
 * Converts a 2D crafting grid into a pipe-separated text grid for LLMs.
 *
 * Example output:
 * minecraft:dirt | null | minecraft:diamond
 * null | minecraft:stick | null
 * null | null | null
 */
export function craftingGridToPipeString(
  grid: CraftGrid,
  options?: {
    nullLabel?: string;
    enforce3x3?: boolean;
  },
): string {
  const nullLabel = options?.nullLabel ?? "null";
  const enforce3x3 = options?.enforce3x3 ?? true;

  if (!Array.isArray(grid) || grid.length === 0) {
    throw new Error("Grid must be a non-empty 2D array.");
  }

  if (enforce3x3) {
    if (grid.length !== 3 || grid.some((row) => row.length !== 3)) {
      throw new Error("Grid must be exactly 3x3.");
    }
  }

  return grid
    .map((row) =>
      row.map((cell) => (cell === null ? nullLabel : cell)).join(" | "),
    )
    .join("\n");
}
