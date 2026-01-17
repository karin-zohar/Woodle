import useModal from "@/libs/hooks/useModal/useModal";
import { Button, Flex } from "antd";
import type { FC } from "react";

type ChangeLevelModalProps = {
  action?: () => void;
};

const ChangeLevelModal: FC<ChangeLevelModalProps> = ({ action }) => {
  const { closeModal } = useModal();
  const handleClose = () => closeModal("end-game");

  const handleEndGame = () => {
    // action();
    handleClose();
  };

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      className="change-level-modal"
      gap={10}
    >
      <span>Are you sure you want to end the current Game? </span>

      <Flex gap={16}>
        <Button onClick={handleClose}>Stay</Button>
        <Button onClick={handleEndGame}>End Game</Button>
      </Flex>
    </Flex>
  );
};

export default ChangeLevelModal;
