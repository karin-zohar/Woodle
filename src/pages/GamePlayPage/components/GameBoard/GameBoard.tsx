import type { FC } from "react";
import type { GameBoardProps, TileRowType } from "@/libs/hooks/useGame";
import TileRow from "./components/TileRow";
import "./game-board.style.css";

const GameBoard: FC<GameBoardProps> = ({ rows }) => {
  return (
    <div className="game-board wood-grain">
      <div className="rows-container">
        {rows.map((row: TileRowType, idx) => (
          <TileRow tiles={row.tiles} key={idx} />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
