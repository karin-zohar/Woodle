import useModal from "@/libs/hooks/useModal/useModal";
import useStore from "@/store/store";
import { Button, Flex } from "antd";

const EndGameModal = () => {
  const { closeModal } = useModal();
  const { confirmWordLengthChange, cancelWordLengthChange } = useStore();

  const handleClose = () => {
    cancelWordLengthChange();
    closeModal("end-game");
  };

  const handleEndGame = () => {
    confirmWordLengthChange();
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
        Are you sure you want to end the current Game?
      </span>

      <Flex gap={16} justify="center">
        <Button onClick={handleClose} size="large">
          Stay
        </Button>
        <Button onClick={handleEndGame} type="primary" danger size="large">
          End Game
        </Button>
      </Flex>
    </Flex>
  );
};

export default EndGameModal;
