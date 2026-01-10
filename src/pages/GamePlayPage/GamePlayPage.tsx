import { useState, type FC } from "react";
import GameBoard from "./components/GameBoard/GameBoard";
import type { TileRowType, TileType } from "./GamePlayPage.type";
import Keyboard from "./components/Keyboard/Keyboard";

type GamePlayPageProps = {};

const GamePlayPage: FC<GamePlayPageProps> = ({}) => {
  const emptyTile: TileType = { status: "empty", content: "" };
  const emptyRow: TileRowType = {
    tiles: Array.from({ length: 5 }, () => emptyTile),
    isActive: false,
  };

  const emptyBoard: TileRowType[] = Array.from({ length: 6 }, (_, i) =>
    i === 0 ? { ...emptyRow, isActive: true } : emptyRow
  );

  const [board, setBoard] = useState<TileRowType[]>(emptyBoard);

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
    <div>
      <GameBoard rows={board} />
      <Keyboard updateTile={updateTile} />
    </div>
  );
};

export default GamePlayPage;
