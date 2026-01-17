import { useLocation, useNavigate } from "react-router";
import { Modal, Flex, Typography, type ModalProps } from "antd";
import GenCloseButton from "../GenCloseButton/GenCloseButton";
import clsx from "clsx";
import { type ReactNode } from "react";
import "./gen-modal.style.css";

const { Title } = Typography;

export interface GenModalProps extends ModalProps {
  queryParam: string;
  title: string;
  theme?: string;
  children: ReactNode;
  className?: string;
  key: string;
}

const GenModal = ({
  queryParam,
  title,
  theme,
  children,
  className,
  key,
  ...props
}: GenModalProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const isOpen = queryParams.get(queryParam) === "true";

  const handleClose = () => {
    const updatedSearchParams = new URLSearchParams(location.search);
    updatedSearchParams.delete(queryParam);

    navigate(
      {
        pathname: location.pathname,
        search: updatedSearchParams.toString(),
      },
      { replace: true }
    );
  };

  return (
    <Modal
      {...props}
      className={clsx(props.classNames, "gen-modal")}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      closable={false} // Hide default Ant Design close button to use GenCloseButton
    >
      <Flex
        className={clsx("gen-modal-inner-container", "theme", theme)}
        vertical
      >
        {/* Internal Close Button logic handled here */}
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
