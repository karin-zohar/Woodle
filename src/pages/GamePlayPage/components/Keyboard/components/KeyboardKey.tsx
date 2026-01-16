import { Button } from "antd";
import { type FC, type ReactNode } from "react";

type KeyboardKeyProps = {
  onType: (key: string) => void;
  value: string;
  label?: ReactNode;
};

const KeyboardKey: FC<KeyboardKeyProps> = ({ onType, value, label }) => {
  return (
    <Button className="keyboard-key" onClick={() => onType(value)}>
      {label ?? value}
    </Button>
  );
};

export default KeyboardKey;
