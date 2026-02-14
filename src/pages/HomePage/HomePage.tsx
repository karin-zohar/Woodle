import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import useStore from "@/store/store";
import { hasOngoingGame } from "@/store/slices/gameSettings.slice";
import { useStartNewGame, useToast } from "@/libs/hooks";
import "./home-page.style.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { gameSettings } = useStore();
  const { startNewGame, isPending } = useStartNewGame();
  const { wordLength } = gameSettings;
  const maxGuessAmount = wordLength + 1;
  const { Title } = Typography;

  const content = {
    header: "Woodle",
    subheader: `Get ${maxGuessAmount} chances to guess a ${
      maxGuessAmount - 1
    }-letter word.`,
    button: "Play",
  };

  const handlePlay = () => {
    if (hasOngoingGame(gameSettings)) {
      navigate("/play");
      return;
    }
    startNewGame(gameSettings.wordLength)
      .then(() => navigate("/play"))
      .catch(() => {
        showToast("error", "Failed to start game. Please try again.");
      });
  };

  const { header, subheader, button: buttonContent } = content;
  return (
    <div className="home-page">
      <div className="text">
        <Title level={1}>{header}</Title>
        <Title level={2}>{subheader}</Title>
      </div>
      <Button
        className="woodle-button play-button"
        block
        onClick={handlePlay}
        type="primary"
        loading={isPending}
      >
        {buttonContent}
      </Button>
    </div>
  );
};

export default HomePage;
