export const defaultSelector = <Input, Output = Input>(value: Input) => {
  return value as unknown as Output;
};
