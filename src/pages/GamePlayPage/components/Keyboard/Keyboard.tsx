import { useEffect, type FC } from "react";
import { Button } from "antd";

type KeyboardProps = {
  submitGuess: () => void;
  onType: (key: string) => void;
};

const Keyboard: FC<KeyboardProps> = ({ submitGuess, onType }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      onType(event.key);
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
