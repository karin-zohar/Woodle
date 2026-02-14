import { useEffect } from "react";
import GameBoard from "./components/GameBoard/GameBoard";
import Keyboard from "./components/Keyboard/Keyboard";
import { useGame, useStartNewGame, useToast } from "@/libs/hooks";
import useStore from "@/store/store";
import { hasOngoingGame } from "@/store/slices/gameSettings.slice";
import "./game-play-page.style.css";

const GamePlayPage = () => {
  const gameSettings = useStore((state) => state.gameSettings);
  const { showToast } = useToast();
  const { startNewGame, isPending } = useStartNewGame();
  const { board, onType, isCheckingWord, currentRowIndex } = useGame();

  // Always fetch a solution when there isn't one (no ongoing game). isPending from store (isFetchingSolution) prevents double-fetch (e.g. Strict Mode).
  useEffect(() => {
    if (hasOngoingGame(gameSettings) || isPending) {
      return;
    }
    startNewGame(gameSettings.wordLength).catch(() => {
      showToast("error", "Failed to start game. Please try again.");
    });
  }, [gameSettings, startNewGame, showToast, isPending]);

  // Never show the board without a solution: show loading until we have an ongoing game.
  if (!hasOngoingGame(gameSettings) || isPending) {
    return (
      <div className="game-play-page game-play-page-loading">
        Loading game…
      </div>
    );
  }

  return (
    <div className="game-play-page">
      <GameBoard rows={board} currentRowIndex={currentRowIndex} isCheckingWord={isCheckingWord} />
      <Keyboard onType={onType} board={board} disabled={isCheckingWord} />
    </div>
  );
};

export default GamePlayPage;
