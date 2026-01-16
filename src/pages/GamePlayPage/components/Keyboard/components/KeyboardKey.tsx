import { Button } from "antd";
import clsx from "clsx";
import { type FC, type ReactNode } from "react";

type KeyboardKeyProps = {
  onType: (key: string) => void;
  value: string;
  label?: ReactNode;
  status: string;
};

const KeyboardKey: FC<KeyboardKeyProps> = ({
  onType,
  value,
  label,
  status,
}) => {
  return (
    <Button
      className={clsx("keyboard-key", status)}
      onClick={() => onType(value)}
    >
      {label ?? value}
    </Button>
  );
};

export default KeyboardKey;
