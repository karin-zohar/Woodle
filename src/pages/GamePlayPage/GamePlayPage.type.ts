export type TileType = {
  status: "empty" | "editing" | "gray" | "yellow" | "green";
  content?: string;
};

export type TileRowType = {
  tiles: TileType[];
};

export type GameBoardProps = {
  rows: TileRowType[];
};
