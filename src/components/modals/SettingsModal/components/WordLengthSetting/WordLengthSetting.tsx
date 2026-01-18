import { Flex, type CheckboxOptionType, type RadioChangeEvent } from "antd";
import GenRadioGroup from "@/libs/ui/components/GenRadioGroup/GenRadioGroup";
import WordLengthSettingOption from "./components/WordLengthSettingOption";
import useStore from "@/store/store";
import useModal from "@/libs/hooks/useModal/useModal";
import useConfirmAction from "@/libs/hooks/useConfirmAction/useConfirmAction";

const VALID_WORD_LENGTHS = [5, 6, 7];

const WordLengthSetting = () => {
  const { gameSettings, setWordLength } = useStore();
  const { openModal } = useModal();
  const { confirm } = useConfirmAction();

  const handleChange = (e: RadioChangeEvent) => {
    const nextValue = e.target.value;
    confirm(() => {
      setWordLength(nextValue);
    });

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
