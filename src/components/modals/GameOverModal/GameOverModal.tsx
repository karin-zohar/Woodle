import { useLocation } from "react-router";
import useStore from "@/store/store";
import useModal from "@/libs/hooks/useModal/useModal";
import { Button, Flex } from "antd";

const GameOverModal = () => {
  const location = useLocation();
  const { closeModal } = useModal();
  const { startNewGame, gameSettings } = useStore();

  const queryParams = new URLSearchParams(location.search);
  const result = queryParams.get("game-over-won") === "true" ? "won" : queryParams.get("game-over-lost") === "true" ? "lost" : null;
  const solution = result === "lost" ? gameSettings.solution : null;

  const handleNewGame = () => {
    startNewGame(gameSettings.wordLength);
    closeModal("game-over");
  };

  const title = result === "won" ? "You won!" : "Game over";
  const message =
    result === "lost" && solution
      ? `The word was ${solution.toUpperCase()}`
      : result === "lost"
        ? "You ran out of guesses."
        : null;

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
