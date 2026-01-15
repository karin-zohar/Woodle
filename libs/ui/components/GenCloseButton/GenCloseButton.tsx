import { type FC } from "react";
import { Button } from "antd";
import { CloseIcon } from "@/libs/ui/icons/index";
import clsx from "clsx";
import "./gen-close-button.style.css";

type GenCloseButtonProps = {
  onClose: () => void;
  size?: "large" | "medium" | "small";
};

const GenCloseButton: FC<GenCloseButtonProps> = ({ onClose, size = "large" }) => {
  return (
    <Button
      className={clsx("gen-close-button", `gen-close-button-${size}`)}
      type="text"
      onClick={onClose}
      icon={<CloseIcon />}
    />
  );
};

export default GenCloseButton;
