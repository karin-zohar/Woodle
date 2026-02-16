import { useEffect, useMemo, type FC } from "react";
import "./keyboard.style.css";
import { Flex } from "antd";
import KeyboardKey from "./components/KeyboardKey";
import { BackspaceIcon } from "@/libs/ui/icons";
import {
  TILE_STATUS,
  type TileRowType,
  type TileStatusValue,
} from "@/libs/hooks";

type KeyboardProps = {
  onType: (key: string) => void;
  board: TileRowType[];
  disabled?: boolean;
};

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
];

const SYSTEM_KEYS = ["enter", "backspace"];

const Keyboard: FC<KeyboardProps> = ({ onType, board, disabled = false }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (disabled) {
        return;
      }
      onType(event.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onType, disabled]);

  const keyStatusMap = useMemo(() => {
    const statusMap: Record<string, TileStatusValue> = {};

    board.forEach((row) => {
      row.tiles.forEach((tile) => {
        if (!tile.content) {
          return;
        }
        const char = tile.content.toLowerCase();
        const currentStatus = statusMap[char];

        // Priority Logic: Correct > Present > Absent
        if (tile.status === TILE_STATUS.CORRECT) {
          statusMap[char] = TILE_STATUS.CORRECT;
        } else if (
          tile.status === TILE_STATUS.PRESENT &&
          currentStatus !== TILE_STATUS.CORRECT
        ) {
          statusMap[char] = TILE_STATUS.PRESENT;
        } else if (tile.status === TILE_STATUS.ABSENT && !currentStatus) {
          statusMap[char] = TILE_STATUS.ABSENT;
        }
      });
    });

    return statusMap;
  }, [board]);

  return (
    <Flex vertical gap={8} className="keyboard">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <Flex key={`row-${rowIndex}`} className="keyboard-row" gap={6}>
          {row.map((keyValue) => {
            const lowerKey = keyValue.toLowerCase();
            const status = SYSTEM_KEYS.includes(lowerKey)
              ? TILE_STATUS.EDITING
              : keyStatusMap[lowerKey] || TILE_STATUS.EDITING;

            return (
              <KeyboardKey
                key={`${rowIndex}-${keyValue}`}
                onType={onType}
                value={keyValue}
                label={keyValue === "Backspace" ? <BackspaceIcon /> : keyValue}
                status={status}
                disabled={disabled}
              />
            );
          })}
        </Flex>
      ))}
    </Flex>
  );
};

export default Keyboard;
