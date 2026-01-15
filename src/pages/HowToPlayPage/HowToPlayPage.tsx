import { TILE_STATUS } from "@/libs/hooks/useGame";
import useStore from "@/store/store";
import { Typography } from "antd";
import ExampleTileRow from "./components/ExampleTileRow";
import "./how-to-play-page.style.css";
import { TreeIcon } from "@/libs/ui/icons";

const HowToPlayPage = () => {
  const { Title } = Typography;
  const { gameSettings } = useStore();
  const { wordLength } = gameSettings;

  const examples = [
    {
      guess: "WORDY",
      statuses: [
        TILE_STATUS.CORRECT,
        TILE_STATUS.EDITING,
        TILE_STATUS.EDITING,
        TILE_STATUS.EDITING,
        TILE_STATUS.EDITING,
      ],
      focusChar: "W",
      caption: "is in the word and in the correct spot.",
    },
    {
      guess: "LIGHT",
      statuses: [
        TILE_STATUS.EDITING,
        TILE_STATUS.PRESENT,
        TILE_STATUS.EDITING,
        TILE_STATUS.EDITING,
        TILE_STATUS.EDITING,
      ],
      focusChar: "I",
      caption: "is in the word but in the wrong spot.",
    },
    {
      guess: "ROGUE",
      statuses: [
        TILE_STATUS.EDITING,
        TILE_STATUS.EDITING,
        TILE_STATUS.EDITING,
        TILE_STATUS.ABSENT,
        TILE_STATUS.EDITING,
      ],
      focusChar: "U",
      caption: "is not in the word in any spot.",
    },
  ];

  return (
    <div className="how-to-play-page">
      <Title level={3}>How To Play</Title>
      <Title level={4}>{`Guess the word in ${wordLength + 1} tries.`}</Title>

      <ul>
        <li>
          <span>
            <TreeIcon />
            <span>Each guess must be a valid {wordLength}-letter word. </span>
          </span>
        </li>

        <li>
          <span>
            <TreeIcon />
            <span>
              The color of the tiles will change to show how close your guess
              was to the word.
            </span>
          </span>
        </li>
      </ul>

      <Title level={5}>Examples</Title>
      <div className="examples-wrapper">
        {examples.map((example) => (
          <div className="example-item" key={example.guess}>
            <ExampleTileRow guess={example.guess} statuses={example.statuses} />
            <span>
              <strong>{example.focusChar}</strong> {example.caption}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowToPlayPage;
