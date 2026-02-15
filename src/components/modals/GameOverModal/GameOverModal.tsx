import { useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import useStore from "@/store/store";
import { getDecodedSolution } from "@/store/slices/gameSettings.slice";
import { useModal, useStartNewGame, useToast } from "@/libs/hooks";
import { Button, Flex } from "antd";

const QUERY_PARAM_GAME_OVER = "game-over";
const QUERY_PARAM_WIN = "win";

const GameOverModal = () => {
  const location = useLocation();
  const { patchModalParams } = useModal();
  const { showToast } = useToast();
  const { gameSettings } = useStore();
  const solution = useStore((state) => getDecodedSolution(state.gameSettings));
  const solutionDefinition = useStore((state) => state.gameSettings.solutionDefinition);
  const { startNewGame, isPending } = useStartNewGame();

  const solutionRef = useRef<string | null>(null);
  if (solution && solutionRef.current === null) {
    solutionRef.current = solution;
  }
  const solutionToShow = solutionRef.current ?? solution;

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const isWin = queryParams.get(QUERY_PARAM_WIN) === "true";

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

  const solutionText = solutionToShow
    ? `The word was ${solutionToShow.toUpperCase()}`
    : "";
  const message = isWin
    ? solutionText
    : solutionText
      ? `You ran out of guesses. ${solutionText}`
      : "You ran out of guesses.";

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
      {solutionDefinition && (
        <span style={{ textAlign: "center", fontStyle: "italic" }}>
         {solutionDefinition}
        </span>
      )}

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
