import type { TileStatusValue } from "@/libs/hooks";
import { Button } from "antd";
import clsx from "clsx";
import type {  FC, ReactNode } from "react";
import { memo } from "react";

type KeyboardKeyProps = {
  onType: (key: string) => void;
  value: string;
  label?: ReactNode;
  status: TileStatusValue;
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
      aria-label={typeof label === "string" ? label : value}
    >
      {label ?? value}
    </Button>
  );
};

export default memo(KeyboardKey);
