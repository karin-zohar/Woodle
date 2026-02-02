import type { FC } from "react";
import { memo } from "react";
import Tile from "./Tile";
import type { TileRowType, TileType } from "@/libs/hooks/useGame";
import clsx from "clsx";

const TileRow: FC<TileRowType> = ({ tiles, isInvalid }) => {
  return (
    <div className={clsx("tile-row", { "invalid-guess": isInvalid })}>
      {tiles.map((tile: TileType, idx) => (
        <Tile status={tile.status} content={tile.content} index={idx} key={idx} />
      ))}
    </div>
  );
};

export default memo(TileRow);
