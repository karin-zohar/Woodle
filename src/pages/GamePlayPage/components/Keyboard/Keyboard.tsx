import { useEffect, type FC } from "react";
import { Button } from "antd";

type KeyboardProps = {
  submitGuess: () => void;
  guesses: string[];
  onType: (key: string) => void;
};

const Keyboard: FC<KeyboardProps> = ({ submitGuess, onType }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const isLetter = /^[a-zA-Z]$/.test(event.key);
      const isBackspace = event.key === "Backspace";
      const isEnter = event.key === "Enter";
      if (isLetter || isBackspace) {
        onType(event.key);
      }
      if (isEnter) {
        submitGuess();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onType]);

  return (
    <div>
      keyboard
      <Button onClick={submitGuess}>submit</Button>
    </div>
  );
};

export default Keyboard;
