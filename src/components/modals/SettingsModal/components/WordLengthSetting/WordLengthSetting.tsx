import { Flex, type CheckboxOptionType, type RadioChangeEvent } from "antd";
import GenRadioGroup from "@/libs/ui/components/GenRadioGroup/GenRadioGroup";
import WordLengthSettingOption from "./components/WordLengthSettingOption";
import useStore from "@/store/store";
import type { WordLength } from "@/store/slices/gameSettings.slice";
import { useModal, useConfirmAction, useStartNewGame, useToast } from "@/libs/hooks";

const VALID_WORD_LENGTHS: WordLength[] = [5, 6, 7];

const WordLengthSetting = () => {
  const { gameSettings } = useStore();
  const { openModal } = useModal();
  const { showToast } = useToast();
  const { startNewGame } = useStartNewGame();
  const { confirm } = useConfirmAction({ eventName: "CONFIRM_END_GAME" });

  const handleChange = (e: RadioChangeEvent) => {
    const nextValue = e.target.value as WordLength;
    confirm(() => {
      startNewGame(nextValue).catch(() => {
        showToast("error", "Failed to start new game. Please try again.");
      });
    });

    openModal("end-game");
  };

  const wordLengthOptions: CheckboxOptionType[] = VALID_WORD_LENGTHS.map(
    (length) => ({
      label: <WordLengthSettingOption value={length} />,
      value: length,
    }),
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
