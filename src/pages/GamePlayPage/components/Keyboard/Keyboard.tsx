import type { Dispatch, FC, SetStateAction } from "react";
import type { TileRowType, TileType } from "../../GamePlayPage.type";
import { Button } from "antd";

type KeyboardProps = {
  updateTile: (
    rowId: number,
    tileId: number,
    newTileDetails: Partial<TileType>
  ) => void;
  setGuesses: Dispatch<SetStateAction<string[]>>;
  activeRow: TileRowType;
};

const Keyboard: FC<KeyboardProps> = ({ updateTile, setGuesses, activeRow }) => {
  // TODO: replace with real function
  const tempUpdate = () => {
    updateTile(0, 0, { status: "green", content: "A" });
    updateTile(0, 1, { status: "yellow", content: "R" });
    updateTile(0, 2, { status: "gray", content: "I" });
    updateTile(0, 3, { status: "green", content: "S" });
    updateTile(0, 4, { status: "yellow", content: "E" });
  };

  const addGuess = () => {
    const guess: string = activeRow.tiles.map((tile) => tile.content).join("");
    // validate guess, if valid:
    setGuesses((prevGuesses) => [...prevGuesses, guess]);
  };

  return (
    <div>
      keyboard
      <Button onClick={tempUpdate}>update</Button>
      <Button onClick={addGuess}>submit</Button>
    </div>
  );
};

export default Keyboard;
