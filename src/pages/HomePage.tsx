import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import useStore from "@/store/store";

const HomePage = () => {
  const navigate = useNavigate();
  const { gameSettings } = useStore();
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

  const { header, subheader, button: buttonContent } = content;
  return (
    <div className="home-page">
      <Title level={1}>{header}</Title>
      <Title level={2}>{subheader}</Title>
      <Button
        size="large"
        className="woodle-button"
        onClick={() => navigate("/play")}
        type={"primary"}
      >
        {buttonContent}
      </Button>
    </div>
  );
};

export default HomePage;
