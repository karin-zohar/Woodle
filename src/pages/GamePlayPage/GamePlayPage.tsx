import GameBoard from "./components/GameBoard/GameBoard";
import Keyboard from "./components/Keyboard/Keyboard";
import { useGame } from "@/libs/hooks/useGame/index";
import "./game-play-page.style.css";

const GamePlayPage = () => {
  const { board, submitGuess, onType } = useGame();

  return (
    <div className="game-play-page">
      <GameBoard rows={board} />
      <Keyboard submitGuess={submitGuess} onType={onType} />
    </div>
  );
};

export default GamePlayPage;
