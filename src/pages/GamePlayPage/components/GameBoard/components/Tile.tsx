import { memo } from "react";
import type { FC } from "react";
import type { TileType } from "@/libs/hooks/useGame";
import clsx from "clsx";

const Tile: FC<TileType> = ({ status, content, index }) => {
  return (
    <div className={clsx("tile", status)} style={{ "--tile-index": index } as React.CSSProperties}>
      {content}
    </div>
  );
};

export default memo(Tile);