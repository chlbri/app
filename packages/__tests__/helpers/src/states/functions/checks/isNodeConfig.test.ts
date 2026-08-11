import { describe, expect, test } from 'vitest';
import { isNodeConfig } from '@bemedev/app/states';

describe('isNodeConfig', () => {
  describe('atomic nodes', () => {
    test('#01 => minimal valid atomic node', () => {
      expect(isNodeConfig({ on: {} })).toBe(true);
    });

    test('#02 => atomic node with type explicitly set to atomic', () => {
      expect(isNodeConfig({ on: {}, type: 'atomic' })).toBe(true);
    });

    test('#03 => atomic node with entry action', () => {
      expect(isNodeConfig({ on: {}, entry: 'onEnter' })).toBe(true);
    });

    test('#04 => atomic node with exit action', () => {
      expect(isNodeConfig({ on: {}, exit: 'onExit' })).toBe(true);
    });

    test('#05 => atomic node with multiple actions', () => {
      expect(
        isNodeConfig({
          on: {},
          entry: ['action1', 'action2'],
          exit: ['action3', 'action4'],
        }),
      ).toBe(true);
    });

    test('#06 => atomic node with description', () => {
      expect(
        isNodeConfig({ on: {}, description: 'Atomic state description' }),
      ).toBe(true);
    });

    test('#07 => atomic node with single tag', () => {
      expect(isNodeConfig({ on: {}, tags: 'important' })).toBe(true);
    });

    test('#08 => atomic node with multiple tags', () => {
      expect(
        isNodeConfig({ on: {}, tags: ['tag1', 'tag2', 'tag3'] }),
      ).toBe(true);
    });

    test('#09 => atomic node with activities', () => {
      expect(
        isNodeConfig({ on: {}, activities: { activity1: 'action1' } }),
      ).toBe(true);
    });

    test('#10 => atomic node with all valid properties', () => {
      expect(
        isNodeConfig({
          on: {},
          entry: 'enter',
          exit: 'exit',
          description: 'Complete atomic node',
          type: 'atomic',
          tags: ['tag1'],
          activities: { act1: 'action1' },
          __longRuns: true,
          strict: false,
        }),
      ).toBe(true);
    });
  });

  describe('compound nodes', () => {
    test('#01 => compound node with single nested state', () => {
      expect(
        isNodeConfig({
          on: {},
          type: 'compound',
          initial: 'idle',
          states: { idle: { on: {} } },
        }),
      ).toBe(true);
    });

    test('#02 => compound node with multiple nested states', () => {
      expect(
        isNodeConfig({
          on: {},
          type: 'compound',
          initial: 'loading',
          states: {
            loading: { on: {} },
            loaded: { on: {} },
            error: { on: {} },
          },
        }),
      ).toBe(true);
    });

    test('#03 => compound node with nested atomic states having actions', () => {
      expect(
        isNodeConfig({
          on: {},
          type: 'compound',
          initial: 'start',
          states: {
            start: { on: {}, entry: 'init', exit: 'cleanup' },
            middle: { on: {}, description: 'Middle state' },
            end: { on: {}, tags: 'final' },
          },
        }),
      ).toBe(true);
    });

    test('#04 => deeply nested compound states', () => {
      expect(
        isNodeConfig({
          on: {},
          type: 'compound',
          initial: 'level1',
          states: {
            level1: {
              on: {},
              type: 'compound',
              initial: 'level2',
              states: {
                level2: {
                  on: {},
                  type: 'compound',
                  initial: 'level3',
                  states: { level3: { on: {} } },
                },
              },
            },
          },
        }),
      ).toBe(true);
    });

    test('#05 => compound node with entry and exit actions', () => {
      expect(
        isNodeConfig({
          on: {},
          type: 'compound',
          initial: 'idle',
          entry: 'initCompound',
          exit: 'cleanupCompound',
          states: { idle: { on: {} } },
        }),
      ).toBe(true);
    });

    test('#06 => compound node with description and tags', () => {
      expect(
        isNodeConfig({
          on: {},
          type: 'compound',
          initial: 'state1',
          description: 'Main state machine',
          tags: ['machine', 'root'],
          states: { state1: { on: {} } },
        }),
      ).toBe(true);
    });
  });

  describe('parallel nodes', () => {
    test('#01 => type not well', () => {
      expect(
        isNodeConfig({
          on: {},
          type: true,
          states: { region1: { on: {} } },
        }),
      ).toBe(false);
    });

    test('#02 => parallel node with single region', () => {
      expect(
        isNodeConfig({
          on: {},
          type: 'parallel',
          states: { region1: { on: {} } },
        }),
      ).toBe(true);
    });

    test('#03 => parallel node with multiple regions', () => {
      expect(
        isNodeConfig({
          on: {},
          type: 'parallel',
          states: {
            region1: { on: {} },
            region2: { on: {} },
            region3: { on: {} },
          },
        }),
      ).toBe(true);
    });

    test('#04 => parallel node with nested compound states', () => {
      expect(
        isNodeConfig({
          on: {},
          type: 'parallel',
          states: {
            region1: {
              on: {},
              type: 'compound',
              initial: 'nested1',
              states: { nested1: { on: {} } },
            },
            region2: {
              on: {},
              type: 'compound',
              initial: 'nested2',
              states: { nested2: { on: {} } },
            },
          },
        }),
      ).toBe(true);
    });

    test('#05 => parallel node with entry and exit actions', () => {
      expect(
        isNodeConfig({
          on: {},
          type: 'parallel',
          entry: 'startParallel',
          exit: 'stopParallel',
          states: { r1: { on: {} }, r2: { on: {} } },
        }),
      ).toBe(true);
    });
  });

  describe('complex mixed structures', () => {
    test('#01 => root compound with mixed atomic and parallel children', () => {
      expect(
        isNodeConfig({
          on: {},
          type: 'compound',
          initial: 'root',
          entry: 'init',
          description: 'Complex state machine',
          tags: ['complex'],
          states: {
            root: {
              on: {},
              type: 'compound',
              initial: 'idle',
              states: {
                idle: {
                  on: {},
                  type: 'atomic',
                  description: 'Idle state',
                },
                active: {
                  on: {},
                  type: 'parallel',
                  states: { worker1: { on: {} }, worker2: { on: {} } },
                },
              },
            },
          },
        }),
      ).toBe(true);
    });

    test('#02 => nested parallel with compound children', () => {
      expect(
        isNodeConfig({
          on: {},
          type: 'parallel',
          states: {
            branch1: {
              on: {},
              type: 'compound',
              initial: 'a',
              states: { a: { on: {} }, b: { on: {} } },
            },
            branch2: {
              on: {},
              type: 'compound',
              initial: 'x',
              states: { x: { on: {} }, y: { on: {} } },
            },
          },
        }),
      ).toBe(true);
    });
  });

  describe('invalid node configs', () => {
    test('#01 => returns false for null', () =>
      expect(isNodeConfig(null)).toBe(false));

    test('#02 => returns false for undefined', () => {
      expect(isNodeConfig(undefined)).toBe(false);
    });

    test('#03 => returns false for string', () =>
      expect(isNodeConfig('state')).toBe(false));

    test('#04 => returns false for number', () =>
      expect(isNodeConfig(42)).toBe(false));

    test('#05 => returns false for array', () =>
      expect(isNodeConfig([])).toBe(false));

    test('#06 => returns false for boolean', () =>
      expect(isNodeConfig(true)).toBe(false));

    test('#07 => returns false for object without required on property', () => {
      expect(isNodeConfig({ type: 'atomic' })).toBe(true);
    });

    test('#08 => returns false for node with invalid on property', () => {
      expect(isNodeConfig({ on: 'invalid' })).toBe(false);
    });

    test('#09 => returns false for node with invalid entry type', () => {
      expect(isNodeConfig({ on: {}, entry: 123 })).toBe(false);
    });

    test('#10 => returns false for node with invalid exit type', () => {
      expect(isNodeConfig({ on: {}, exit: { invalid: 'action' } })).toBe(
        false,
      );
    });

    test('#11 => returns false for node with invalid description type', () => {
      expect(isNodeConfig({ on: {}, description: 123 })).toBe(false);
    });

    test('#12 => returns false for node with invalid tags type', () => {
      expect(isNodeConfig({ on: {}, tags: 123 })).toBe(false);
    });

    test('#13 => returns false for node with invalid type value', () => {
      expect(isNodeConfig({ on: {}, type: 'invalid' })).toBe(false);
    });

    test('#14 => returns false for node with unknown key', () => {
      expect(isNodeConfig({ on: {}, unknownKey: 'value' })).toBe(false);
    });

    test('#15 => returns false for compound node with invalid nested state', () => {
      expect(
        isNodeConfig({
          on: {},
          type: 'compound',
          initial: 'valid',
          states: { valid: { on: {} }, invalid: null },
        }),
      ).toBe(false);
    });

    test('#16 => returns false for parallel node with invalid region', () => {
      expect(
        isNodeConfig({
          on: {},
          type: 'parallel',
          states: { region1: { on: {} }, region2: 'invalid' },
        }),
      ).toBe(false);
    });
  });

  describe('isNodeConfig.orUndefined', () => {
    test('#01 => returns true for undefined', () => {
      expect(isNodeConfig.orUndefined(undefined)).toBe(true);
    });

    test('#02 => returns true for valid node config', () => {
      expect(isNodeConfig.orUndefined({ on: {}, type: 'atomic' })).toBe(
        true,
      );
    });

    test('#03 => returns true for valid compound node', () => {
      expect(
        isNodeConfig.orUndefined({
          on: {},
          type: 'compound',
          initial: 'state',
          states: { state: { on: {} } },
        }),
      ).toBe(true);
    });

    test('#04 => returns false for null', () => {
      expect(isNodeConfig.orUndefined(null)).toBe(false);
    });

    test('#05 => returns false for string', () => {
      expect(isNodeConfig.orUndefined('state')).toBe(false);
    });
  });

  describe('edge cases', () => {
    test('#01 => empty states object in compound node is valid', () => {
      expect(isNodeConfig({ on: {}, type: 'compound', states: {} })).toBe(
        true,
      );
    });

    test('#02 => not well describer', () => {
      expect(
        isNodeConfig({ entry: { name: 'enter', invalid: 'unexpected' } }),
      ).toBe(false);
    });

    test('#03 => empty states object in parallel node is valid', () => {
      expect(isNodeConfig({ on: {}, type: 'parallel', states: {} })).toBe(
        true,
      );
    });

    describe('activities', () => {
      test('#01 => node with all activity types', () => {
        expect(
          isNodeConfig({
            on: {},
            activities: {
              act1: 'action1',
              act2: ['action2', 'action3'],
              act3: { actions: 'action4' },
            },
          }),
        ).toBe(true);
      });

      test('#02 => node with activity not well formed #1', () => {
        expect(isNodeConfig({ on: {}, activities: 56 })).toBe(false);
      });

      test('#03 => node with activity not well formed #2', () => {
        expect(isNodeConfig({ on: {}, activities: null })).toBe(false);
      });

      test('#04 => node with activity not well formed #3', () => {
        expect(isNodeConfig({ on: {}, activities: { act: null } })).toBe(
          false,
        );
      });

      test('#05 => node with activity not well formed #4', () => {
        expect(isNodeConfig({ on: {}, activities: { act: {} } })).toBe(
          false,
        );
      });

      test('#06 => node with activity not well formed #5', () => {
        expect(
          isNodeConfig({ on: {}, activities: { act: () => 4 } }),
        ).toBe(false);
      });

      test('#07 => node with activity not well formed #6', () => {
        expect(
          isNodeConfig({
            on: {},
            activities: { act: { invalid: false } },
          }),
        ).toBe(false);
      });

      test('#08 => node with activity not well formed #7', () => {
        expect(
          isNodeConfig({ on: {}, activities: { act: { guards: false } } }),
        ).toBe(false);
      });

      test('#09 => node with activity not well formed #8', () => {
        expect(
          isNodeConfig({
            on: {},
            activities: { act: { guards: 'returnTrue' } },
          }),
        ).toBe(false);
      });

      test('#10 => node with activity with guards', () => {
        expect(
          isNodeConfig({
            on: {},
            activities: {
              act: { guards: 'returnTrue', actions: 'action1' },
            },
          }),
        ).toBe(true);
      });
    });

    test('#04 => node with transitions config', () => {
      expect(isNodeConfig({ on: { EVENT: 'nextState' } })).toBe(true);
    });

    test('#05 => node with always transitions', () => {
      expect(
        isNodeConfig({ on: {}, always: { target: 'nextState' } }),
      ).toBe(true);
    });

    test('#06 => node with after transitions', () => {
      expect(isNodeConfig({ on: {}, after: { 5000: 'nextState' } })).toBe(
        true,
      );
    });

    test('#07 => node with actors config, with actors not well defined, returns false', () => {
      expect(isNodeConfig({ on: {}, actors: { actor1: {} } })).toBe(false);
    });

    test('#08 => node with actors config, with actors not well defined #2, returns false', () => {
      expect(
        isNodeConfig({
          on: {},
          actors: { actor1: { on: { EVENT: 57 } } },
        }),
      ).toBe(false);
    });
  });

  describe('actors config', () => {
    test('#01 => notwell #1', () => {
      expect(isNodeConfig({ actors: null })).toBe(false);
    });

    test('#02 => notwell #2', () => {
      expect(isNodeConfig({ actors: true })).toBe(false);
    });

    describe('emitter config', () => {
      test('#01 => nemitter is null, returns false', () => {
        expect(isNodeConfig({ on: {}, actors: { emitter1: null } })).toBe(
          false,
        );
      });

      test('#02 => node with valid emitter config', () => {
        expect(
          isNodeConfig({
            on: {},
            actors: {
              emitter1: {
                description: 'An emitter actor',
                next: 'nextState',
                error: 'errorState',
                complete: 'completeState',
              },
            },
          }),
        ).toBe(true);
      });

      test('#03 => node with valid emitter config without complete', () => {
        expect(
          isNodeConfig({
            on: {},
            actors: {
              emitter1: {
                description: 'An emitter actor',
                next: 'nextState',
                error: 'errorState',
              },
            },
          }),
        ).toBe(true);
      });

      test('#04 => description not well formatted', () => {
        expect(
          isNodeConfig({
            on: {},
            actors: {
              emitter1: {
                description: new Date(),
                next: 'nextState',
                error: 'errorState',
                complete: 'completeState',
              },
            },
          }),
        ).toBe(false);
      });

      test('#05 => error not well formatted', () => {
        expect(
          isNodeConfig({
            on: {},
            actors: {
              emitter1: {
                next: 'nextState',
                error: false,
                complete: 'completeState',
              },
            },
          }),
        ).toBe(false);
      });

      test('#06 => node with emitter config with actions in complete, without target, but without next, returns false', () => {
        expect(
          isNodeConfig({
            on: {},
            actors: {
              emitter1: { complete: [{ actions: 'finalAction' }] },
            },
          }),
        ).toBe(false);
      });

      describe('finally config in emitter config', () => {
        test('#01 => node with emitter config with finally config as string, returns true', () => {
          expect(
            isNodeConfig({
              on: {},
              actors: {
                emitter1: { next: 'next', complete: 'finalAction' },
              },
            }),
          ).toBe(true);
        });

        test('#02 => node with emitter config with finally config as array of transition configs, returns true', () => {
          expect(
            isNodeConfig({
              on: {},
              actors: {
                emitter1: {
                  next: 'next',
                  complete: [{ actions: 'finalAction' }],
                },
              },
            }),
          ).toBe(true);
        });

        test('#03 => empty array as finally config, returns false', () => {
          expect(
            isNodeConfig({
              on: {},
              actors: { emitter1: { next: 'next', complete: [] } },
            }),
          ).toBe(false);
        });

        test('#04 => node with emitter config with finally config as array of transition configs, with one invalid transition config, returns false', () => {
          expect(
            isNodeConfig({
              on: {},
              actors: {
                emitter1: {
                  next: 'next',
                  complete: [
                    { invalid: 'config' },
                    { actions: 'finalAction' },
                  ],
                },
              },
            }),
          ).toBe(false);
        });

        test('#05 => node with emitter config with finally config as array of transition configs, with one invalid transition config #2, returns false', () => {
          expect(
            isNodeConfig({
              on: {},
              actors: {
                emitter1: {
                  next: 'next',
                  complete: [
                    { description: 'config', actions: 'action1' },
                    { actions: 'finalAction' },
                  ],
                },
              },
            }),
          ).toBe(false);
        });

        test('#06 => node with emitter config with finally config as array of transition configs, with last invalid, returns false', () => {
          expect(
            isNodeConfig({
              on: {},
              actors: {
                emitter1: {
                  next: 'next',
                  complete: [
                    { actions: 'finalAction' },
                    { invalid: 'config' },
                  ],
                },
              },
            }),
          ).toBe(false);
        });
      });
    });

    describe('children', () => {
      test('#01 => not well description', () => {
        expect(
          isNodeConfig({
            on: {},
            actors: { child1: { contexts: {}, description: 123 } },
          }),
        ).toBe(false);
      });

      test('#02 => not well #1', () => {
        expect(
          isNodeConfig({
            on: {},
            actors: { child1: { contexts: undefined, on: undefined } },
          }),
        ).toBe(false);
      });

      test('#03 => not well #2', () => {
        expect(
          isNodeConfig({ on: {}, actors: { child1: { contexts: true } } }),
        ).toBe(false);
      });

      test('#04 => not well #3', () => {
        expect(
          isNodeConfig({
            on: {},
            actors: { child1: { contexts: { value: {} } } },
          }),
        ).toBe(false);
      });

      test('#05 => not well #4', () => {
        expect(
          isNodeConfig({
            on: {},
            actors: {
              child1: { contexts: { value: new Intl.DateTimeFormat() } },
            },
          }),
        ).toBe(false);
      });

      test('#06 => not well #5', () => {
        expect(
          isNodeConfig({ on: {}, actors: { child1: { on: null } } }),
        ).toBe(false);
      });

      test('#07 => not well #6', () => {
        expect(
          isNodeConfig({
            on: {},
            actors: {
              child1: {
                on: { EVENT: { target: 'nextState', guards: 123 } },
              },
            },
          }),
        ).toBe(false);
      });

      test('#08 => well #1', () => {
        expect(
          isNodeConfig({
            on: {},
            actors: { child1: { contexts: {}, on: undefined } },
          }),
        ).toBe(true);
      });

      test('#09 => well #2', () => {
        expect(
          isNodeConfig({ on: {}, actors: { child1: { on: {} } } }),
        ).toBe(true);
      });
    });
  });

  describe('guards', () => {
    test('#01 => well guards', () => {
      expect(
        isNodeConfig({
          on: { EVENT: { target: 'nextState', guards: 'isValid' } },
        }),
      ).toBe(true);
    });

    test('#02 => guards invalid empty object', () => {
      expect(
        isNodeConfig({
          on: { EVENT: { target: 'nextState', guards: {} } },
        }),
      ).toBe(false);
    });

    test('#03 => guards invalid key', () => {
      expect(
        isNodeConfig({
          on: {
            EVENT: { target: 'nextState', guards: { invalid: 'isValid' } },
          },
        }),
      ).toBe(false);
    });

    describe('complex', () => {
      test('#01 => not well #1', () => {
        expect(
          isNodeConfig({
            on: {
              EVENT: {
                target: 'nextState',
                guards: { and: { invalid: 'isValid' } },
              },
            },
          }),
        ).toBe(false);
      });

      test('#02 => not well #2', () => {
        expect(
          isNodeConfig({
            on: {
              EVENT: { target: 'nextState', guards: { and: 'invalid' } },
            },
          }),
        ).toBe(false);
      });

      test('#03 => not well #3', () => {
        expect(
          isNodeConfig({
            on: {
              EVENT: {
                target: 'nextState',
                guards: {
                  and: { name: 'notValid', description: 'invalid guard' },
                },
              },
            },
          }),
        ).toBe(false);
      });

      test('#04 => not well #4', () => {
        expect(
          isNodeConfig({
            on: {
              EVENT: {
                target: 'nextState',
                guards: {
                  or: [
                    { name: 'valid', description: 'valid guard' },
                    { and: 'invalid' },
                  ],
                },
              },
            },
          }),
        ).toBe(false);
      });

      test('#05 => not well, empty guards #1', () => {
        expect(
          isNodeConfig({
            on: { EVENT: { target: 'nextState', guards: { and: [] } } },
          }),
        ).toBe(false);
      });

      test('#06 => not well, empty guards #2', () => {
        expect(
          isNodeConfig({
            on: { EVENT: { target: 'nextState', guards: { or: [] } } },
          }),
        ).toBe(false);
      });
    });
  });

  describe('transitions', () => {
    test('#01 => not well #1', () => {
      expect(isNodeConfig({ on: { EVENT: { guards: 'isValid' } } })).toBe(
        false,
      );
    });

    test('#02 => not well #2, empty array', () => {
      expect(isNodeConfig({ on: { EVENT: [] } })).toBe(false);
    });

    test('#03 => not well #3, array with last invalid transition config', () => {
      expect(
        isNodeConfig({
          on: {
            EVENT: [
              { target: 'nextState', guards: 'isValid' },
              { invalid: 'config' },
            ],
          },
        }),
      ).toBe(false);
    });

    test('#04 => not well #4, array with one invalid transition config', () => {
      expect(
        isNodeConfig({
          on: {
            EVENT: [
              { invalid: 'config' },
              { target: 'nextState', guards: 'isValid' },
            ],
          },
        }),
      ).toBe(false);
    });

    test('#05 => not well #5, array with one invalid transition config, previous must have an guard', () => {
      expect(
        isNodeConfig({
          on: {
            EVENT: [
              { target: 'prev' },
              { target: 'nextState', guards: 'isValid' },
            ],
          },
        }),
      ).toBe(false);
    });

    test('#06 => not well #6', () => {
      expect(
        isNodeConfig({
          on: {
            EVENT: [
              { description: 234, target: 'nextState', guards: 'isValid' },
            ],
          },
        }),
      ).toBe(false);
    });

    test('#07 => not well #7', () => {
      expect(isNodeConfig({ on: { EVENT: [{ target: 345 }] } })).toBe(
        false,
      );
    });

    test('#08 => not well #8', () => {
      expect(isNodeConfig({ on: { EVENT: [{ actions: 345 }] } })).toBe(
        false,
      );
    });

    test('#09 => not well #9', () => {
      expect(isNodeConfig({ on: { EVENT: 'notInside' } }, 'inside')).toBe(
        false,
      );
    });

    test('#10 => not well #10', () => {
      expect(
        isNodeConfig.orUndefined(
          { on: { EVENT: { target: 'notInside' } } },
          'inside',
        ),
      ).toBe(false);
    });

    test('#11 => always not well #1', () => {
      expect(isNodeConfig({ always: null })).toBe(false);
    });

    test('#12 => always not well #2', () => {
      expect(isNodeConfig({ always: {} })).toBe(false);
    });

    test('#13 => always not well #3', () => {
      expect(isNodeConfig({ always: { actions: 'action1' } })).toBe(false);
    });

    test('#14 => always not well #4', () => {
      expect(
        isNodeConfig({
          always: [
            { actions: 'action1' },
            { actions: 'action1', target: 'nextState' },
          ],
        }),
      ).toBe(false);
    });

    test('#15 => always not well #5', () => {
      expect(
        isNodeConfig({
          always: [
            { actions: 'action1', target: 'nextState' },
            { actions: 'action1', target: 'nextState' },
          ],
        }),
      ).toBe(false);
    });

    test('#16 => always not well #6', () => {
      expect(isNodeConfig({ always: [] })).toBe(false);
    });

    test('#17 => always not well #7', () => {
      expect(
        isNodeConfig({
          always: [
            { actions: 'action1', target: 'nextState', guards: 'isValid' },
            { actions: 'action1' },
          ],
        }),
      ).toBe(false);
    });

    test('#18 => always well #1', () => {
      expect(
        isNodeConfig({
          always: [
            { actions: 'action1', target: 'nextState', guards: 'isValid' },
            { actions: 'action1', target: 'nextState' },
          ],
        }),
      ).toBe(true);
    });

    test('#19 => always well #2', () => {
      expect(isNodeConfig.orUndefined({ always: 'nextState' })).toBe(true);
    });

    test('#20 => well formated', () => {
      expect(
        isNodeConfig({
          on: {
            EVENT: [
              { target: 'prev', guards: 'isValid' },
              { target: 'nextState' },
            ],
          },
        }),
      ).toBe(true);
    });
  });
});
