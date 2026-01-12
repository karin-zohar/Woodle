import { useState } from "react";
import GameBoard from "./components/GameBoard/GameBoard";
import Keyboard from "./components/Keyboard/Keyboard";
import type { TileRowType, TileType } from "./GamePlayPage.type";
import "./game-play-page.style.css";
import { useGame } from "@/libs/hooks/useGame";

const GamePlayPage = () => {
  const { gameSettings } = useGame();
  const { wordLength } = gameSettings;

  const emptyTile: TileType = { status: "empty" };
  const emptyRow: TileRowType = {
    tiles: Array.from({ length: wordLength }, () => emptyTile),
  };

  const emptyBoard: TileRowType[] = Array.from(
    { length: wordLength + 1 },
    () => emptyRow
  );

  const [board, setBoard] = useState<TileRowType[]>(emptyBoard);
  const [guesses, setGuesses] = useState<string[]>([]);
  const activeRowIdx = guesses.length;

  const updateTile = (
    rowId: number,
    tileId: number,
    newTileDetails: Partial<TileType>
  ) => {
    setBoard((prev) =>
      prev.map((row, rIdx) => {
        if (rIdx !== rowId) {
          return row;
        }

        return {
          ...row,
          tiles: row.tiles.map((tile, tIdx) =>
            tIdx === tileId ? { ...tile, ...newTileDetails } : tile
          ),
        };
      })
    );
  };

  return (
    <div className="game-play-page">
      <GameBoard rows={board} />
      <Keyboard
        updateTile={updateTile}
        setGuesses={setGuesses}
        activeRow={board[activeRowIdx]}
      />
    </div>
  );
};

export default GamePlayPage;
