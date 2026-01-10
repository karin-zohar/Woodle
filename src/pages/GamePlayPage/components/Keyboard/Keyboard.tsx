import type { FC } from "react";
import type { TileType } from "../../GamePlayPage.type";
import { Button } from "antd";

type KeyboardProps = {
  updateTile: (
    rowId: number,
    tileId: number,
    newTileDetails: Partial<TileType>
  ) => void;
};

const Keyboard: FC<KeyboardProps> = ({ updateTile }) => {
  // TODO: replace with real function
  const tempUpdate = () => {
    updateTile(0, 0, { status: "green", content: "A" });
    updateTile(0, 1, { status: "yellow", content: "R" });
    updateTile(0, 2, { status: "gray", content: "I" });
    updateTile(0, 3, { status: "green", content: "S" });
    updateTile(0, 4, { status: "yellow", content: "E" });
  };

  return (
    <div>
      keyboard
      <Button onClick={tempUpdate}>update</Button>
    </div>
  );
};

export default Keyboard;
