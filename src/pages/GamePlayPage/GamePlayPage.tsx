import GameBoard from "./components/GameBoard/GameBoard";
import Keyboard from "./components/Keyboard/Keyboard";
import "./game-play-page.style.css";
import { useGame } from "@/libs/hooks/useGame/index";

const GamePlayPage = () => {
  const { board, updateTile, addGuess, guesses } = useGame();

  return (
    <div className="game-play-page">
      <GameBoard rows={board} />
      <Keyboard updateTile={updateTile} addGuess={addGuess} guesses={guesses} />
    </div>
  );
};

export default GamePlayPage;
