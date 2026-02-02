import type { FC } from "react";
import type { GameBoardProps, TileRowType } from "@/libs/hooks/useGame";
import TileRow from "./components/TileRow";
import "./game-board.style.css";
import clsx from "clsx";
import useStore from "@/store/store";

const GameBoard: FC<GameBoardProps> = ({ rows }) => {
  const { gameSettings } = useStore();
  const { wordLength } = gameSettings;
  const boardSize = wordLength > 5 ? "large" : "regular";

  return (
    <div className={clsx("game-board", "wood-grain", boardSize)}>
      <div className="rows-container">
        {rows.map((row: TileRowType, idx) => (
          <TileRow tiles={row.tiles} isInvalid={row.isInvalid} key={idx} />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
