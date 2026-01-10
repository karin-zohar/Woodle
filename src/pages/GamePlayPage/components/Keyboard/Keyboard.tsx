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
    updateTile(1, 1, { status: "green", content: "B" });
  };

  return (
    <div>
      keyboard
      <Button onClick={tempUpdate}>update</Button>
    </div>
  );
};

export default Keyboard;
