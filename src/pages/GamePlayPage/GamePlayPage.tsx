import GameBoard from "./components/GameBoard/GameBoard";
import Keyboard from "./components/Keyboard/Keyboard";
import { useGame } from "@/libs/hooks";
import "./game-play-page.style.css";

const GamePlayPage = () => {
  const { board, onType } = useGame();

  return (
    <div className="game-play-page">
      <GameBoard rows={board} />
      <Keyboard onType={onType} board={board} />
    </div>
  );
};

export default GamePlayPage;
