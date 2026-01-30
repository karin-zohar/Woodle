import dispatchCustomEvent from "@/libs/helpers/dispatchCustomEvent";
import { GAME_EVENTS } from "@/libs/constants/gameEvents";
import useModal from "@/libs/hooks/useModal/useModal";
import { Button, Flex } from "antd";

const EndGameModal = () => {
  const { closeModal } = useModal();

  const handleChoice = (shouldEndGame: boolean) => {
    if (shouldEndGame) {
      dispatchCustomEvent(GAME_EVENTS.CONFIRM_END_GAME);
    } else {
      dispatchCustomEvent(GAME_EVENTS.CANCEL_END_GAME);
    }
    closeModal("end-game");
  };

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      className="end-game-modal"
      gap={20}
    >
      <span style={{ textAlign: "center" }}>
        Are you sure you want to end the current game?
      </span>

      <Flex gap={16} justify="center">
        <Button
          className="woodle-button"
          onClick={() => handleChoice(false)}
          size="middle"
        >
          Continue Game
        </Button>
        <Button
          className="woodle-button"
          onClick={() => handleChoice(true)}
          type="primary"
          danger
          size="middle"
        >
          End Game
        </Button>
      </Flex>
    </Flex>
  );
};

export default EndGameModal;
