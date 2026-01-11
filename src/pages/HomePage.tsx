import { Button, Typography } from "antd";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

type HomePageProps = {
  guessAmount: number;
};

type GameStatus = "notStarted" | "inProgress" | "finished";

const MAX_GUESS_AMOUNT = 6;

const HomePage: FC<HomePageProps> = ({ guessAmount = 0 }) => {
  const navigate = useNavigate();
  const { Title } = Typography;
  const gameStatus: GameStatus =
    guessAmount > 0
      ? guessAmount < MAX_GUESS_AMOUNT
        ? "inProgress"
        : "finished"
      : "notStarted";

  const contentByStatus = {
    notStarted: {
      header: "Woodle",
      subheader: `Get ${MAX_GUESS_AMOUNT} chances to guess a ${
        MAX_GUESS_AMOUNT - 1
      }-letter word.`,
      button: "Play",
    },
    inProgress: {
      header: "Welcome Back",
      subheader: `You've made ${guessAmount} out of ${MAX_GUESS_AMOUNT} guesses. Keep it up!`,
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
