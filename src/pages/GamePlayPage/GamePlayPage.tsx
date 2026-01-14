import GameBoard from "./components/GameBoard/GameBoard";
import Keyboard from "./components/Keyboard/Keyboard";
import "./game-play-page.style.css";
import { useGame } from "@/libs/hooks/useGame/index";

const GamePlayPage = () => {
  const { board, submitGuess, guesses, onType } = useGame();

  return (
    <div className="game-play-page">
      <GameBoard rows={board} />
      <Keyboard submitGuess={submitGuess} guesses={guesses} onType={onType} />
    </div>
  );
};

export default GamePlayPage;
