import { memo } from "react";
import type { FC } from "react";
import type { TileType } from "@/libs/hooks/useGame";
import clsx from "clsx";

const Tile: FC<TileType> = ({ status, content }) => {
  return (
    <div className={clsx("tile", status)}>
      {content}
    </div>
  );
};

// Use memo here
export default memo(Tile);