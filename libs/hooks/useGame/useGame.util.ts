import type { TileType, TileRowType } from "./index";

const createEmptyTile = (): TileType => ({ status: "empty" });

export const createEmptyRow = (wordLength: number): TileRowType => ({
  tiles: Array.from({ length: wordLength }, createEmptyTile),
});
