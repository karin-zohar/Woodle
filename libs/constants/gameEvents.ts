export const GAME_EVENTS = {
  SUBMIT_NOT_ENOUGH_LETTERS: 'submit-not-enough-letters',
  SUBMIT_NOT_IN_WORD_LIST: 'submit-not-in-word-list',
  SUBMIT_UNKNOWN_ERROR: 'submit-unknown-error',
  GAME_OVER_WON: 'game-over-won',
  GAME_OVER_LOST: 'game-over-lost',
  CONFIRM_END_GAME: 'CONFIRM_END_GAME',
  CANCEL_END_GAME: 'CANCEL_END_GAME',
} as const;

export type GameEventName = (typeof GAME_EVENTS)[keyof typeof GAME_EVENTS];
