import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import useStore from "@/store/store";
import { useModal, useStartNewGame, useToast } from "@/libs/hooks";
import { Button, Flex } from "antd";

const QUERY_PARAM_GAME_OVER = "game-over";
const QUERY_PARAM_WIN = "win";

const GameOverModal = () => {
  const location = useLocation();
  const { patchModalParams } = useModal();
  const { showToast } = useToast();
  const { gameSettings } = useStore();
  const { startNewGame, isPending } = useStartNewGame();

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const isWin = queryParams.get(QUERY_PARAM_WIN) === "true";
  const solution = gameSettings.solution;

  const handleNewGame = () => {
    startNewGame(gameSettings.wordLength)
      .then(() => {
        patchModalParams({
          [QUERY_PARAM_GAME_OVER]: false,
          [QUERY_PARAM_WIN]: false,
        });
      })
      .catch(() => {
        showToast("error", "Failed to start new game. Please try again.");
      });
  };

  const title = isWin ? "You won!" : "Game over";

  const solutionText = `The word was ${solution.toUpperCase()}`;
  const message = isWin ? solutionText : `You ran out of guesses. ${solutionText}`;

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      className="game-over-modal"
      gap={20}
    >
      <span style={{ textAlign: "center", fontWeight: 600 }}>{title}</span>
      {message && <span style={{ textAlign: "center" }}>{message}</span>}

      <Button
        className="woodle-button"
        onClick={handleNewGame}
        variant="outlined"
        size="middle"
        loading={isPending}
      >
        New Game
      </Button>
    </Flex>
  );
};

export default GameOverModal;
