import { Flex, type CheckboxOptionType, type RadioChangeEvent } from "antd";
import GenRadioGroup from "@/libs/ui/components/GenRadioGroup/GenRadioGroup";
import WordLengthSettingOption from "./components/WordLengthSettingOption";
import useStore from "@/store/store";
import { WORD_LENGTHS, type WordLength } from "@/store/slices/gameSettings.slice";
import { useModal, useConfirmAction, useStartNewGame, useToast } from "@/libs/hooks";

const WordLengthSetting = () => {
  const wordLength = useStore((state) => state.gameSettings.wordLength);
  const setWordLength = useStore((state) => state.setWordLength);
  const { openModal } = useModal();
  const { showToast } = useToast();
  const { startNewGame } = useStartNewGame();
  const { confirm } = useConfirmAction({ eventName: "CONFIRM_END_GAME" });

  const handleChange = (e: RadioChangeEvent) => {
    const nextValue = e.target.value as WordLength;
    confirm(() => {
      const prev = useStore.getState().gameSettings.wordLength;
      setWordLength(nextValue);
      startNewGame(nextValue).catch(() => {
        setWordLength(prev);
        showToast("error", "Failed to start new game. Please try again.");
      });
    });

    openModal("end-game");
  };

  const wordLengthOptions: CheckboxOptionType[] = WORD_LENGTHS.map(
    (length) => ({
      label: <WordLengthSettingOption value={length} />,
      value: length,
    }),
  );

  return (
    <Flex className="setting setting-word-length" gap={10} vertical>
      <span>Word Length</span>
      <GenRadioGroup
        key={wordLength}
        value={wordLength}
        options={wordLengthOptions}
        onChange={handleChange}
      />
    </Flex>
  );
};

export default WordLengthSetting;
