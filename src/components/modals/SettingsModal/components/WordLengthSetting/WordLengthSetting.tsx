import { Flex, type CheckboxOptionType, type RadioChangeEvent } from "antd";
import GenRadioGroup from "@/libs/ui/components/GenRadioGroup/GenRadioGroup";
import WordLengthSettingOption from "./components/WordLengthSettingOption";
import useStore from "@/store/store";
import useModal from "@/libs/hooks/useModal/useModal";

const VALID_WORD_LENGTHS = [5, 6, 7];

const WordLengthSetting = () => {
  const { gameSettings, requestWordLengthChange } = useStore();
  const { openModal } = useModal();

  const handleChange = (e: RadioChangeEvent) => {
    const nextValue = e.target.value;
    requestWordLengthChange(nextValue);
    openModal("end-game");
  };

  const wordLengthOptions: CheckboxOptionType[] = VALID_WORD_LENGTHS.map(
    (length) => ({
      label: <WordLengthSettingOption value={length} />,
      value: length,
    })
  );

  return (
    <Flex className="setting setting-word-length" gap={10} vertical>
      <span>Word Length</span>
      <GenRadioGroup
        value={gameSettings.wordLength}
        options={wordLengthOptions}
        onChange={handleChange}
      />
    </Flex>
  );
};

export default WordLengthSetting;
