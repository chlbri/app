export type Fn<Args extends any[] = any[], R = any> = (...args: Args) => R;
export type FnBasic<Main extends Fn, Tr extends object> = Tr & Main;
