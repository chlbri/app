import { _any, tupleOf } from '@bemedev/app/bemedev';
import { identity, sleep } from '@bemedev/app/utils';
import { vi, expect, test } from 'vitest';
import type { ConstructTests_F } from './constructTests.types';
import { fakeWaiter } from './helpers';
import { buildIndex, buildInvite } from './invite';
import type { ConstructTestsResult2, RejectionHandler } from './types';

export { ConstructTests_F };

/**
 * Constructs test suites and assertion utilities for an interpreter instance.
 *
 * @param vi - Vitest utility instance.
 * @param service - Interpreter service instance (sync or async).
 * @param helper - Optional helper builder callback function.
 * @param startIndex - Starting index for test step numbers (defaults to `0`).
 *
 * @returns Constructed test helpers object.
 */
export const constructTests: ConstructTests_F = (
  service,
  helper,
  startIndex = 0,
) => {
  let _index = startIndex;
  const index = (__index?: number) => {
    const num = __index ?? _index;
    const out = buildIndex(num, Math.max(90, num + 5));
    _index++;
    return out;
  };

  const errorsOrWarnings = (
    type: '_errorsCollector' | '_warningsCollector',
  ) => {
    const str = type === '_errorsCollector' ? 'errors' : 'warnings';
    return (...warnings: string[]) => {
      const invite = `#${index()} => Expect ${str} : ${warnings.join(', ')}`;
      return tupleOf(invite, () => {
        const cases = warnings.map(
          (warning, index) =>
            [
              buildInvite(
                `${warning} should be in service.${type}`,
                index + 1,
                Math.max(90, warnings.length + 5),
              ),
              warning,
            ] as const,
        );

        test.each([...cases])('%s', (_, warning) => {
          expect(service[type]).toContain(warning);
        });
      });
    };
  };

  const out: ConstructTestsResult2 = {
    ...helper?.({
      tupleOf: (invite, assertion) => [invite, assertion],
      waiter: (DELAY = 150) => {
        return (times = 1, _index) => {
          const invite = `#${index(_index)} => Wait ${times} times ${DELAY}ms`;

          return tupleOf(invite, async () => {
            try {
              await fakeWaiter(vi, DELAY, times);
            } catch {
              // In case of fake timers, this can throw if the timers are not properly handled.
            }
          });
        };
      },

      contexts: (selector, name) => (value, _index) => {
        const isNo = value === undefined || value === null;
        const _selector = selector ?? identity;

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
      service,

      sender: type => {
        return (...___payload: any[]) => {
          const invite = `#${index()} => send ${type} event with payload`;

          return tupleOf(invite, async () => {
            const sender = service.sender(type);
            sender(...(___payload as any));
            await fakeWaiter(vi, 0);
          });
        };
      },
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
      const invite = `#${index()} => Error : ${error} should be thrown`;

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
      const invite = `#${index(_index)} => send ${event}`;

      return tupleOf(invite, async () => {
        service.send(_any(_event));
        await fakeWaiter(vi, 0);
      });
    },

    start: _index => {
      const invite = `#${index(_index)} => Start the service`;
      return tupleOf(invite, async () => {
        service.start();
        await fakeWaiter(vi, 0);
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

    useTags: (...tags) => {
      const invite = `#${index()} => Tags are : ${tags.join(', ')}`;
      return tupleOf(invite, () => {
        expect(service.tags).toEqual(expect.arrayContaining(tags as any));
      });
    },
  };

  return _any(out);
};
