import { useEffect, useMemo, type FC } from "react";
import "./keyboard.style.css";
import { Flex } from "antd";
import KeyboardKey from "./components/KeyboardKey";
import { BackspaceIcon } from "@/libs/ui/icons";
import {
  TILE_STATUS,
  type TileRowType,
  type TileType,
} from "@/libs/hooks/useGame";

type KeyboardProps = {
  onType: (key: string) => void;
  guesses: string[];
  board: TileRowType[];
};

const Keyboard: FC<KeyboardProps> = ({ onType, guesses, board }) => {
  console.log("guesses: ", guesses);
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

  const allTiles = useMemo(() => {
    return board.flatMap((row) => row.tiles);
  }, [board]);

  const getKeyStatus = (value: string) => {
    const char = value.toLowerCase();

    const isSystemKey = char === "enter" || char === "backspace";
    const hasBeenGuessed = guesses.some((guess) =>
      guess.toLowerCase().includes(char)
    );

    if (isSystemKey || !hasBeenGuessed) {
      return TILE_STATUS.EDITING;
    }

    const charStatuses = allTiles
      .filter(
        (tile: TileType) => tile.content && tile.content.toLowerCase() === char
      )
      .map((tile: TileType) => tile.status);

    // Priority Logic: Correct/Present take precedence over Absent
    if (charStatuses.includes(TILE_STATUS.CORRECT)) {
      return TILE_STATUS.CORRECT;
    }
    if (charStatuses.includes(TILE_STATUS.PRESENT)) {
      return TILE_STATUS.PRESENT;
    }
    if (charStatuses.includes(TILE_STATUS.ABSENT)) {
      return TILE_STATUS.ABSENT;
    }

    // Deafault
    return TILE_STATUS.EDITING;
  };

  return (
    <Flex vertical gap={8} className="keyboard">
      {keyboardRows.map((row, rowIndex) => (
        <Flex key={`row-${rowIndex}`} className="keyboard-row" gap={6}>
          {row.map((keyValue) => (
            <KeyboardKey
              key={`${rowIndex}-${keyValue}`}
              onType={onType}
              value={keyValue}
              label={keyValue === "Backspace" ? <BackspaceIcon /> : keyValue}
              status={getKeyStatus(keyValue)}
            />
          ))}
        </Flex>
      ))}
    </Flex>
  );
};

export default Keyboard;
