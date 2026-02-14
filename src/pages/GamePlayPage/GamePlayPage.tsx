import { useEffect } from "react";
import GameBoard from "./components/GameBoard/GameBoard";
import Keyboard from "./components/Keyboard/Keyboard";
import { useGame, useStartNewGame, useToast } from "@/libs/hooks";
import useStore from "@/store/store";
import { hasOngoingGame, needsSolution } from "@/store/slices/gameSettings.slice";
import "./game-play-page.style.css";

const GamePlayPage = () => {
  const gameSettings = useStore((state) => state.gameSettings);
  const { showToast } = useToast();
  const { startNewGame, isPending } = useStartNewGame();
  const { board, onType } = useGame();

  useEffect(() => {
    if (!hasOngoingGame(gameSettings)) {
      startNewGame(gameSettings.wordLength).catch(() => {
        showToast("error", "Failed to start game. Please try again.");
      });
    }
  }, [gameSettings, startNewGame, showToast]);

  if (isPending && needsSolution(gameSettings)) {
    return (
      <div className="game-play-page game-play-page-loading">
        Loading game…
      </div>
    );
  }

  return (
    <div className="game-play-page">
      <GameBoard rows={board} />
      <Keyboard onType={onType} board={board} />
    </div>
  );
};

export default GamePlayPage;
