import type { FC } from "react";
import "./game-board.style.css";
import type { GameBoardProps } from "../../GamePlayPage.type";
import TileRow from "./components/TileRow";

const GameBoard: FC<GameBoardProps> = ({ rows }) => {
  return (
    <div className="game-board wood-grain">
      <div className="rows-container">
        {rows.map((row) => (
          <TileRow tiles={row.tiles} isActive={row.isActive} />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
