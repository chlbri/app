import { _any, expandFn, tupleOf } from '@bemedev/app/bemedev';
import { fakeWaiter } from './helpers';
import type { ConstructTests_F } from './index.types';
import { buildIndex, buildInvite } from './invite';
import type { ConstructTestsResult2, RejectionHandler } from './types';
import { expect, test } from 'vitest';
import { sleep } from '@bemedev/app/utils';

export * from './constants';
export * from './helpers';
export * from './index.types';
export * from './invite';
export * from './types';

export const constructTests: ConstructTests_F = (
  service,
  helper,
  startIndex = 0,
) => {
  let _index = startIndex;
  const index = (__index?: number) => {
    if (__index !== undefined) return __index + '';
    const out = buildIndex(_index, Math.max(100, _index + 5));
    _index++;
    return out;
  };

  const errorsOrWarnings = (
    type: '_errorsCollector' | '_warningsCollector',
  ) => {
    const str = type === '_errorsCollector' ? 'errors' : 'warnings';
    return expandFn(
      (...warnings: string[]) => {
        const invite = `#${index()} => Expect ${str} : ${warnings.join(', ')}`;
        return tupleOf(invite, () => {
          const cases = warnings.map(
            (warning, index) =>
              [
                buildInvite(
                  `${warning} should be in service.${type}`,
                  index,
                  Math.max(100, warnings.length),
                ),
                warning,
              ] as const,
          );

          test.each([...cases])('#%$ => %s', (_, warning) => {
            expect(service[type]).toContain(warning);
          });
        });
      },
      {
        index: (_index: number, ...warnings: string[]) => {
          const invite = `#${index(_index)} => Expect ${str} : ${warnings.join(', ')}`;
          return tupleOf(invite, () => {
            const cases = warnings.map(
              (warning, index) =>
                [
                  buildInvite(
                    `${warning} should be in service.${type}`,
                    index + 1,
                    Math.max(100, warnings.length + 1),
                  ),
                  warning,
                ] as const,
            );

            test(
              buildInvite(
                `Length of ${str} should be ${warnings.length}`,
                0,
                Math.max(100, warnings.length + 1),
              ),
              () => {
                expect(service[type]?.values()?.toArray()?.length).toBe(
                  warnings.length,
                );
              },
            );
            test.each([...cases])('%s', (_, warning) => {
              expect(service[type]).toContain(warning);
            });
          });
        },
      },
    );
  };

  const out: ConstructTestsResult2 = {
    ...helper?.({
      tupleOf: (invite, assertion) => [invite, assertion],
      waiter: (DELAY = 150) => {
        return (times = 1, _index) => {
          const invite = `#${index(_index)} => Wait ${times} times ${DELAY}ms`;

          return tupleOf(invite, async () => {
            try {
              await fakeWaiter(DELAY, times);
            } catch {
              // In case of fake timers, this can throw if the timers are not properly handled.
            }
          });
        };
      },

      contexts: (selector, name) => (value, _index) => {
        const isNo = value === undefined || value === null;
        const _defaultSelector = (value: any) => value;
        const _selector = selector ?? _defaultSelector;

        const _value = isNo
          ? 'undefined'
          : JSON.stringify(value).substring(0, 15);

        const _name = name ?? 'context';
        const invite = `#${index(_index)} => ${_name} equal : ${_value}`;

        return tupleOf(invite, () => {
          const received = _selector({
            context: service.context,
            pContext: service._pContext as any,
          });

          expect(received).toEqual(value);
        });
      },

      getIndex: index,

      sender: expandFn(
        type => {
          return (...___payload: any[]) => {
            const invite = `#${index()} => send ${type} event with payload`;

            return tupleOf(invite, async () => {
              const sender = service.sender(type);
              sender(...(___payload as any));
              await fakeWaiter(0);
            });
          };
        },
        {
          index: (type: string) => {
            return (...___payload: any[]) => {
              const __payload = _any(___payload);

              const _payload = JSON.stringify(__payload[1]).substring(
                0,
                15,
              );
              const _index =
                __payload[0] < 10 ? '0' + __payload[0] : __payload[0];
              const invite = `#${index(_index)} => send ${type} event with payload : ${_payload}`;
              const payload = __payload[1] ?? {};
              const event: any = { type, payload };
              return tupleOf(invite, async () => {
                service.send(event);
                await fakeWaiter(0);
              });
            };
          },
        },
      ),
    }),

    useWarnings: errorsOrWarnings('_warningsCollector'),
    useErrors: errorsOrWarnings('_errorsCollector'),

    useStateValue: (value, _index) => {
      const _value = JSON.stringify(value);
      const invite = `#${index(_index)} => current value is :${_value}`;

      return tupleOf(invite, () => {
        expect(service.state.value).toEqual(value);
      });
    },

    changeIndex: fn => {
      const value = fn(_index);
      const invite = `#${index()} Change the current index to ${value}`;

      return tupleOf(invite, () => {
        _index = value;
      });
    },

    unhandledRejection: (testFn, error, timeout = 100) => {
      const invite = `#${index(_index)} => Error : ${error} should be thrown`;

      const handler: RejectionHandler = (_error: any) => {
        const msg =
          _error instanceof Error ? _error.message : String(_error);
        expect(msg).toEqual(error);
      };

      const fn = async () => {
        process.on('unhandledRejection', handler);
        process.on('uncaughtException', handler);

        try {
          testFn();
          await sleep(timeout);
        } catch (error) {
          handler(error, Promise.resolve());
        } finally {
          process.off('unhandledRejection', handler);
          process.off('uncaughtException', handler);
        }
      };

      return tupleOf(invite, fn);
    },

    send: (_event, _index) => {
      const event = JSON.stringify(_event);
      const invite = `#${index(_index)}=> send ${event}`;

      return tupleOf(invite, async () => {
        service.send(_any(_event));
        await fakeWaiter(0);
      });
    },

    start: _index => {
      const invite = `#${index(_index)} => Start the service`;
      return tupleOf(invite, async () => {
        service.start();
        await fakeWaiter(0);
      });
    },

    stop: _index => {
      const invite = `#${index(_index)} => Stop the service`;
      return tupleOf(invite, service.stop);
    },

    dispose: _index => {
      const invite = `#${index(_index)} => Dispose the service`;
      return tupleOf(invite, service.stop);
    },

    pause: _index => {
      const invite = `#${index(_index)} => Pause the service`;
      return tupleOf(invite, service.pause);
    },

    resume: _index => {
      const invite = `#${index(_index)} => Resume the service`;
      return tupleOf(invite, service.resume);
    },

    useTags: expandFn(
      (...tags) => {
        const invite = `#${index()} => Tags are : ${tags.join(', ')}`;
        return tupleOf(invite, () => {
          expect(service.tags).toEqual(
            expect.arrayContaining(tags as any),
          );
        });
      },
      {
        index: (index: number, ...tags: any[]) => {
          const _index = index < 10 ? '0' + index : index;
          const invite = `#${_index} => Tags are : ${tags.join(', ')}`;
          return tupleOf(invite, () => {
            expect(service.tags).toEqual(
              expect.arrayContaining(tags as any),
            );
          });
        },
      },
    ),
  };

  return _any(out);
};
