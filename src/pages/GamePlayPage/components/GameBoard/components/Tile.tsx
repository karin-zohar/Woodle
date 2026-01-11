import clsx from "clsx";
import type { FC } from "react";
import type { TileType } from "../../../GamePlayPage.type";

const Tile: FC<TileType> = ({ status, content }) => {
  return (
    <div className={clsx("tile", status)}>
      {content ?? <span>{content}</span>}
    </div>
  );
};

export default Tile;
