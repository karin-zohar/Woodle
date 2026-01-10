import { useState, type FC } from "react";
import GameBoard from "./components/GameBoard/GameBoard";
import type { TileRowType, TileType } from "./GamePlayPage.type";

type GamePlayPageProps = {};

const GamePlayPage: FC<GamePlayPageProps> = ({}) => {
  const emptyTile: TileType = { status: "empty" };
  const emptyRow: TileRowType = {
    tiles: Array.from({ length: 5 }, () => emptyTile),
    isActive: false,
  };

  const emptyBoard: TileRowType[] = Array.from({ length: 6 }, (_, i) =>
    i === 0 ? { ...emptyRow, isActive: true } : emptyRow
  );

  const [board, setBoard] = useState<TileRowType[]>(emptyBoard);

  return (
    <div>
      <GameBoard rows={board} />
    </div>
  );
};

export default GamePlayPage;
