import { type ReactNode } from "react";
import { useLocation } from "react-router";
import { Modal, Flex, Typography, type ModalProps } from "antd";
import useModal from "@/libs/hooks/useModal/useModal";
import GenCloseButton from "../GenCloseButton/GenCloseButton";
import clsx from "clsx";
import "./gen-modal.style.css";

const { Title } = Typography;

export interface GenModalProps extends ModalProps {
  queryParam: string;
  title: string;
  theme?: string;
  children: ReactNode;
  className?: string;
}

const GenModal = ({
  queryParam,
  title,
  theme,
  children,
  className,
  ...props
}: GenModalProps) => {
  const location = useLocation();
  const { closeModal } = useModal();

  const queryParams = new URLSearchParams(location.search);
  const isOpen = queryParams.get(queryParam) === "true";

  const handleClose = () => {
    closeModal(queryParam);
  };

  return (
    <Modal
      {...props}
      className={clsx(props.classNames, "gen-modal", className)}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      closable={false}
    >
      <Flex
        className={clsx("gen-modal-inner-container", "theme", theme)}
        vertical
      >
        <GenCloseButton onClose={handleClose} size="small" />

        <Title level={2} className="gen-modal-inner-title">
          {title}
        </Title>

        <Flex className="gen-modal-inner-content" vertical>
          {children}
        </Flex>
      </Flex>
    </Modal>
  );
};

export default GenModal;
