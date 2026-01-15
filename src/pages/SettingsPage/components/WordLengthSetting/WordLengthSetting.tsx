import { Flex, type CheckboxOptionType, type RadioChangeEvent } from "antd";
import GenRadioGroup from "@/libs/ui/components/GenRadioGroup/GenRadioGroup";
import WordLengthSettingOption from "./components/WordLengthSettingOption";
import useStore from "@/store/store";

const VALID_WORD_LENGTHS = [5, 6, 7];

const WordLengthSetting = () => {
  const { gameSettings, setWordLength } = useStore();
  const handleChange = (e: RadioChangeEvent) => {
    setWordLength(e.target.value);
  };

  const wordLengthOptions: CheckboxOptionType[] = VALID_WORD_LENGTHS.map(
    (length) => ({
      label: <WordLengthSettingOption value={length} />,
      value: length,
    })
  );

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
