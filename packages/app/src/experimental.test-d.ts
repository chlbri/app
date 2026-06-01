import type { FlatMapN, NodeConfig } from '#states';

export type KeysNodeConfig<T extends NodeConfig> = keyof FlatMapN<T>;
