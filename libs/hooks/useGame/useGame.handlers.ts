import type { ToastType } from '../useToast/useToast';
import { GAME_EVENTS } from '@/libs/constants/gameEvents';
import type { PatchModalParams } from '../useModal/useModal';
import { GAME_OVER_MODAL_DELAY_MS, winMessages } from './useGame.const';

const openGameOverModal = (
  patchModalParams: PatchModalParams,
  isWin: boolean
): void => {
  setTimeout(() => {
    patchModalParams({
      "game-over": true,
      "win": isWin,
    });
  }, GAME_OVER_MODAL_DELAY_MS);
};

export type SubmitHandler = (
  showToast: (type: ToastType, text: string) => void,
  event: CustomEvent,
  patchModalParams?: PatchModalParams
) => void;

export const SUBMIT_HANDLERS: Record<string, SubmitHandler> = {
  [GAME_EVENTS.SUBMIT_NOT_ENOUGH_LETTERS]: (showToast) =>
    showToast("info", "Not enough letters"),
  [GAME_EVENTS.SUBMIT_NOT_IN_WORD_LIST]: (showToast) =>
    showToast("info", "Not in word list"),
  [GAME_EVENTS.SUBMIT_UNKNOWN_ERROR]: (showToast) =>
    showToast("error", "Something went wrong"),
  [GAME_EVENTS.GAME_OVER_WON]: (showToast, event, patchModalParams) => {
    const guessesLength = event.detail as number;

    setTimeout(() => {
      showToast("info", winMessages[guessesLength - 1] ?? "Game Over");
    }, 3000);

    if (patchModalParams) {
      openGameOverModal(patchModalParams, true);
    }
  },
  [GAME_EVENTS.GAME_OVER_LOST]: (showToast, event, patchModalParams) => {
    const solution = event.detail as string;
    showToast("info", solution);
    if (patchModalParams) {
      openGameOverModal(patchModalParams, false);
    }
  },
};
