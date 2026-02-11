import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import useStore from "@/store/store";
import { useModal } from "@/libs/hooks";
import { Button, Flex } from "antd";

const QUERY_PARAM_GAME_OVER = "game-over";
const QUERY_PARAM_WIN = "win";

const GameOverModal = () => { 
  const location = useLocation();
  const { patchModalParams } = useModal();
  const { startNewGame, gameSettings } = useStore();

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const isWin = queryParams.get(QUERY_PARAM_WIN) === "true";
  const solution = gameSettings.solution;

  const handleNewGame = () => {
    startNewGame(gameSettings.wordLength);
    patchModalParams({
      [QUERY_PARAM_GAME_OVER]: false,
      [QUERY_PARAM_WIN]: false,
    });
  };

  const title = isWin ? "You won!" : "Game over";

  const message = isWin
    ? `The word was ${solution.toUpperCase()}`
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

      <Button
        className="woodle-button"
        onClick={handleNewGame}
        variant="outlined"
        size="middle"
      >
        New Game
      </Button>
    </Flex>
  );
};

export default GameOverModal;
