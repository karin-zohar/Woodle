import type { FC } from "react";
import clsx from "clsx";
import Tile from "./Tile";
import type { TileRowType } from "../../../GamePlayPage.type";

const TileRow: FC<TileRowType> = ({ tiles, isActive }) => {
  return (
    <div className={clsx("tile-row", isActive && "active")}>
      {tiles.map((tile) => (
        <Tile status={tile.status} content={tile.content} />
      ))}
    </div>
  );
};

export default TileRow;
