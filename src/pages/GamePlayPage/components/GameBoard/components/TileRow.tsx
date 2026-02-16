import type { FC } from "react";
import { memo } from "react";
import Tile from "./Tile";
import type { TileRowType, TileType } from "@/libs/hooks";
import clsx from "clsx";

const TileRow: FC<TileRowType> = ({ tiles, isInvalid, isWin, isValidating }) => {
  return (
    <div
      className={clsx("tile-row", {
        "invalid-guess": isInvalid,
        win: isWin,
        "tile-row-validating": isValidating,
      })}
      style={{ "--tiles-count": tiles.length } as React.CSSProperties}
    >
      {tiles.map((tile: TileType, idx) => (
        <Tile status={tile.status} content={tile.content} index={idx} key={idx} />
      ))}
    </div>
  );
};

export default memo(TileRow);
