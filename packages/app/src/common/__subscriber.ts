/**
 * Backward-compatible alias of the contract-first subscriber module.
 *
 * The historical standalone implementation declared its own event, context and
 * tag type parameters. It is now a thin re-export so there is a single
 * contract-driven subscriber in the package.
 *
 * @deprecated Import from `./subscriber` instead.
 */

export {
  createSubscriber,
  type CreateSubscriber_F,
  type SubscriberOptions,
} from './subscriber';
export type { Subscriber as SubscriberClass } from './subscriber';
