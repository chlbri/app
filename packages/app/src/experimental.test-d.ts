import type { FlatMapN, NodeConfig2 } from '#states';

export type KeysNodeConfig<T extends NodeConfig2> = keyof FlatMapN<T>;
