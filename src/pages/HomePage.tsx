import { useGame } from "@/libs/hooks/useGame";
import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";

type GameStatus = "notStarted" | "inProgress" | "finished";

const HomePage = () => {
  const navigate = useNavigate();
  const { gameSettings, guesses } = useGame();
  const { wordLength } = gameSettings;
  const maxGuessAmount = wordLength + 1;
  const guessAmount = guesses.length;

  const { Title } = Typography;

  const gameStatus: GameStatus =
    guessAmount > 0
      ? guessAmount < maxGuessAmount
        ? "inProgress"
        : "finished"
      : "notStarted";

  const contentByStatus = {
    notStarted: {
      header: "Woodle",
      subheader: `Get ${maxGuessAmount} chances to guess a ${
        maxGuessAmount - 1
      }-letter word.`,
      button: "Play",
    },
    inProgress: {
      header: "Welcome Back",
      subheader: `You've made ${guessAmount} out of ${maxGuessAmount} guesses. Keep it up!`,
      button: "Continue",
    },
    finished: {
      header: "Hi Woodler",
      subheader: "Game over",
      button: "Play Again",
    },
  };

  const {
    header,
    subheader,
    button: buttonContent,
  } = contentByStatus[gameStatus];
  return (
    <div className="home-page">
      <Title level={1}>{header}</Title>
      <Title level={2}>{subheader}</Title>
      <Button onClick={() => navigate("/play")}>{buttonContent}</Button>
    </div>
  );
};

export default HomePage;
