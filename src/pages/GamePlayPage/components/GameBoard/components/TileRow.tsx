import type { FC } from "react";
import { memo } from "react";
import Tile from "./Tile";
import type { TileRowType, TileType } from "@/libs/hooks/useGame";
import { TILE_STATUS } from "@/libs/hooks/useGame/useGame.type";
import clsx from "clsx";

const TileRow: FC<TileRowType> = ({ tiles, isInvalid }) => {
  const isWin = tiles.length > 0 && tiles.every((t) => t.status === TILE_STATUS.CORRECT);
  return (
    <div
      className={clsx("tile-row", { "invalid-guess": isInvalid, win: isWin })}
      style={{ "--tiles-count": tiles.length } as React.CSSProperties}
    >
      {tiles.map((tile: TileType, idx) => (
        <Tile status={tile.status} content={tile.content} index={idx} key={idx} />
      ))}
    </div>
  );
};

export default memo(TileRow);
