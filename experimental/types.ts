/**
 * Strongly typed for each of the category
 *
 *
 * the string[] is for hierarchy of description
 * that the IA must follow to create the token,
 * or a description of a state (or other type of tokens),
 * that the AI can better understand what the user really wants
 */
type Helper = Record<string, string[]>;

export type Props = {
  /**
   * For the entire contract /app
   */
  general: string[];
  actors: { children: Helper; emotters: Helper };
  delays: Helper;
  actions: Helper;
  guards: Helper;
  states: Helper;
};
