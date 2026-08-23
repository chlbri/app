/**
 * Supported activity and timer action strings.
 */
export type TimeActionsTypes =
  | 'pauseActivity'
  | 'resumeActivity'
  | 'stopActivity'
  | 'pauseTimer'
  | 'resumeTimer'
  | 'stopTimer';

/**
 * Internal union of base action category strings.
 */
type _ActionTypes =
  | 'assign'
  | 'void'
  | 'sendTo'
  | 'resend'
  | 'forceSend'
  | 'debounce'
  | TimeActionsTypes;

/**
 * Prefixed action category string types.
 */
export type ActionTypes = `actions.${_ActionTypes}`;
