/**
 * The first event in the machine lifecycle.
 * This event is used to initialize the machine.
 */
export const INIT_EVENT = 'machine$$init' as const;

/**
 * The event that is triggered when the machine peforms an always transition.
 */
export const ALWAYS_EVENT = 'machine$$always' as const;

/**
 * The event that is triggered when the machine peforms an after transition.
 */
export const AFTER_EVENT = 'machine$$after' as const;
