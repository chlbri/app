# CHANGE LOG

## Version [1.0.0]

- First version of `@bemedev/interval3`
- `interval` is now a `() => number` function, called on every pass
- Scheduling relies on a `while` loop with `sleep`, replacing `setInterval`
- Provides `createInterval3` (aliases `createInterval` and `create`)
- Provides the abstract `Timer3` base class and the `IntervalListener`,
  `IntervalParams`, `PauserListener`, `IntervalFn` and `RenewIntervalParams` types
- Re-exports `sleep` from `@bemedev/sleep` through the `helpers` subpath
