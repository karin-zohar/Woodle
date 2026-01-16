import { useEffect, type FC } from "react";
import "./keyboard.style.css";
import { Flex } from "antd";
import KeyboardKey from "./components/KeyboardKey";
import { BackspaceIcon } from "@/libs/ui/icons";
type KeyboardProps = {
  onType: (key: string) => void;
};

const Keyboard: FC<KeyboardProps> = ({ onType }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      onType(event.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onType]);

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
  ];

  return (
    <Flex vertical gap={8} className="keyboard">
      {keyboardRows.map((row, rowIndex) => (
        <Flex key={`row-${rowIndex}`} className="keyboard-row" gap={6}>
          {row.map((key) => (
            <KeyboardKey
              key={key}
              onType={onType}
              value={key}
              label={key === "Backspace" ? <BackspaceIcon /> : key}
            />
          ))}
        </Flex>
      ))}
    </Flex>
  );
};

export default Keyboard;
