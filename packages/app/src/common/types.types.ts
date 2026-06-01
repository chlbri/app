export type TimeActionsTypes =
  | 'pauseActivity'
  | 'resumeActivity'
  | 'stopActivity'
  | 'pauseTimer'
  | 'resumeTimer'
  | 'stopTimer';

type _ActionTypes =
  | 'assign'
  | 'void'
  | 'sendTo'
  | 'resend'
  | 'forceSend'
  | 'debounce'
  | TimeActionsTypes;

export type ActionTypes = `actions.${_ActionTypes}`;

export type AppTypes = ActionTypes | 'guards' | 'pContext' | 'context';
