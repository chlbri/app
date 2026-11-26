/**
 * Strongly typed description hierarchy for each category of machine tokens.
 *
 * The `string[]` is the hierarchy of descriptions the AI must follow to create
 * the token, or the description of a state (or any other token type), so the AI
 * can better understand what the user really wants.
 */
export type Helper = Record<string, string[]>;

/**
 * Description hierarchy attached to a contract with `describe`.
 */
export type DescriptionProps = Partial<{
  /**
   * Description hierarchy for the entire contract or machine.
   */
  general: string[];
  actors: { children: Helper; emotters: Helper };
  delays: Helper;
  actions: Helper;
  guards: Helper;
  states: Helper;
}>;
