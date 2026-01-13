import type { FC } from "react";
import Tile from "./Tile";
import type { TileRowType, TileType } from "@/libs/hooks/useGame";

const TileRow: FC<TileRowType> = ({ tiles }) => {
  return (
    <div className={"tile-row"}>
      {tiles.map((tile: TileType) => (
        <Tile status={tile.status} content={tile.content} />
      ))}
    </div>
  );
};

export default TileRow;
