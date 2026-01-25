import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import useStore from "@/store/store";
import './home-page.style.css'

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
      <div className="text">
      <Title level={1}>{header}</Title>
      <Title level={2}>{subheader}</Title>
      </div>
      <Button 
      className="woodle-button play-button" 
      block 
      onClick={() => navigate("/play")}
      type={'primary'}
      >
        {buttonContent}
        </Button>
    </div>
  );
};

export default HomePage;
