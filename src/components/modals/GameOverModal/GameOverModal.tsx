import { useLocation } from "react-router";
import useStore from "@/store/store";
import { useModal } from "@/libs/hooks";
import { Button, Flex } from "antd";

const GameOverModal = () => {
  const location = useLocation();
  const { patchModalParams } = useModal();
  const { startNewGame, gameSettings } = useStore();

  const queryParams = new URLSearchParams(location.search);
  const isOpen = queryParams.get("game-over") === "true";
  const isWin = queryParams.get("win") === "true";
  const solution = !isWin && isOpen ? gameSettings.solution : null;

  const handleNewGame = () => {
    startNewGame(gameSettings.wordLength);
    patchModalParams({
      "game-over": false,
      "win": false,
    });
  };

  const title = isWin ? "You won!" : "Game over";

  let message: string | null = null;
  if (!isWin && isOpen) {
    message = solution ? `The word was ${solution.toUpperCase()}` : "You ran out of guesses.";
  }

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      className="game-over-modal"
      gap={20}
    >
      <span style={{ textAlign: "center", fontWeight: 600 }}>
        {title}
      </span>
      {message && (
        <span style={{ textAlign: "center" }}>{message}</span>
      )}

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
