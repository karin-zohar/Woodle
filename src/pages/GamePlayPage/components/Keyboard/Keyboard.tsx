import type { FC } from "react";
import { Button } from "antd";
import type { TileType } from "@/libs/hooks/useGame";

type KeyboardProps = {
  updateTile: (
    rowId: number,
    tileId: number,
    newTileDetails: Partial<TileType>
  ) => void;
  addGuess: () => void;
  guesses: string[];
};

const Keyboard: FC<KeyboardProps> = ({ updateTile, addGuess, guesses }) => {
  // TODO: replace with real function
  const tempUpdate = () => {
    updateTile(0, 0, { status: "editing", content: "A" });
    updateTile(0, 1, { status: "editing", content: "R" });
    updateTile(0, 2, { status: "editing", content: "I" });
    updateTile(0, 3, { status: "editing", content: "S" });
    updateTile(0, 4, { status: "editing", content: "E" });
  };

  return (
    <div>
      keyboard
      <Button onClick={tempUpdate}>update</Button>
      <Button onClick={addGuess}>submit</Button>
      <Button onClick={() => console.log("guesses:", guesses)}>
        show guesses
      </Button>
    </div>
  );
};

export default Keyboard;
