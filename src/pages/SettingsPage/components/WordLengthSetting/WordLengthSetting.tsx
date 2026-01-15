import { Flex, type CheckboxOptionType, type RadioChangeEvent } from "antd";
import GenRadioGroup from "@/libs/ui/components/GenRadioGroup/GenRadioGroup";
import WordLengthSettingOption from "./components/WordLengthSettingOption";
import useStore from "@/store/store";

const wordLengthOptions: CheckboxOptionType[] = [
  {
    label: <WordLengthSettingOption value={5} />,
    value: 5,
  },
  {
    label: <WordLengthSettingOption value={6} />,
    value: 6,
  },
  {
    label: <WordLengthSettingOption value={7} />,
    value: 7,
  },
];
const WordLengthSetting = () => {
  const { gameSettings, setWordLength } = useStore();
  const handleChange = (e: RadioChangeEvent) => {
    setWordLength(e.target.value);
  };

  //TODO:
  //   1. Disable if game is active
  return (
    <Flex className="setting setting-word-length" gap={10} vertical>
      <span>{`Word Length`}</span>
      <GenRadioGroup
        value={gameSettings.wordLength}
        options={wordLengthOptions}
        onChange={handleChange}
      />
    </Flex>
  );
};

export default WordLengthSetting;
