export type TileType = {
  status: "empty" | "editing" | "gray" | "yellow" | "green";
  content?: string;
};

export type TileRowType = {
  tiles: TileType[];
  isActive: boolean;
};

export type GameBoardProps = {
  rows: TileRowType[];
};
