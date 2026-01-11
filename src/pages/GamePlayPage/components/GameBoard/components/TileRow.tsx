import type { FC } from "react";
import Tile from "./Tile";
import type { TileRowType } from "../../../GamePlayPage.type";

const TileRow: FC<TileRowType> = ({ tiles }) => {
  return (
    <div className={"tile-row"}>
      {tiles.map((tile) => (
        <Tile status={tile.status} content={tile.content} />
      ))}
    </div>
  );
};

export default TileRow;
