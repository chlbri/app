export const defaultC = {
  pContext: undefined,
  context: undefined,
} as const;

export const defaultT = {
  ...defaultC,
  eventsMap: {},
  actorsMap: {
    children: {},
    emitters: {},
  },
} as const;

export const emptyFn = () => {};

export const emptyActionFn = () => () => ({});
