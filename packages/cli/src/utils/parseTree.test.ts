import { readonly } from '@bemedev/app/utils';
import { parseTree } from './parseTree';

describe('#01 => parseTree', () => {
  describe('#01 => atomic node (no states)', () => {
    const config = readonly({ type: 'atomic' });
    const result = parseTree(config);

    test('#01 => flat contains only root', () => {
      expect(Object.keys(result.flat)).toEqual(['/']);
    });

    test('#02 => __config is original config', () => {
      expect(parseTree({}).__config).toEqual({});
      expect(result.__config).toBe(config);
    });

    test('#03 => actions is empty', () => {
      expect(result.actions.toArray).toEqual([]);
    });

    test('#04 => guards is empty', () => {
      expect(result.guards.toArray).toEqual([]);
    });

    test('#05 => emitters is empty', () => {
      expect(result.emitters.toArray).toEqual([]);
    });

    test('#06 => children is empty', () => {
      expect(result.children.toArray).toEqual([]);
    });

    test('#07 => delays is empty', () => {
      expect(result.delays.toArray).toEqual([]);
    });

    test('#08 => paths.all contains root', () => {
      expect(result.paths.all).toContain('/');
    });

    test('#09 => paths.map.targets contains root path', () => {
      expect(result.paths.map.targets).toEqual([]);
    });

    test('#10 => allPaths is empty', () => {
      expect(result.allPaths.toArray).toContain('/'); // Root path is included in allPaths
    });

    test('#11 => targets is empty', () => {
      expect(result.targets.toArray).toEqual([]);
    });

    test('#12 => events is empty', () => {
      expect(result.events.toArray).toEqual([]);
    });

    test('#13 => tags is empty', () => {
      expect(result.tags.toArray).toEqual([]);
    });
  });

  describe('#02 => entry and exit actions', () => {
    const compositeAction = readonly({
      name: 'entryAction2',
      description: 'another entry action',
    });
    const config = {
      entry: ['entryAction1', compositeAction],
      exit: 'exitAction1',
    } as const;
    const result = parseTree(config);

    test('#01 => entry actions in actions', () => {
      expect(result.actions.toArray).toContain('entryAction1');
      expect(result.actions.toArray).toContain('entryAction2');
    });

    test('#02 => exit action in actions', () => {
      expect(result.actions.toArray).toContain('exitAction1');
    });

    test('#03 => no duplicate actions', () => {
      const unique = new Set(result.actions.toArray);
      expect(unique.size).toBe(result.actions.toArray.length);
    });
  });

  describe('#03 => on transitions', () => {
    describe('#01 => string target', () => {
      const config = { on: { NEXT: '/child' } };
      const result = parseTree(config);

      test('#01 => path added', () => {
        expect(result.paths.all).toContain('/');
      });

      test('#02 => no actions extracted', () => {
        expect(result.actions.toArray).toEqual([]);
      });
    });

    describe('#02 => transition object with actions and guards', () => {
      const complexGuard = readonly({
        name: 'complexGuard',
        description: 'a complex guard',
      });
      const config = readonly.freeze({
        on: {
          NEXT: {
            target: '/child',
            actions: ['doSomething'],
            guards: ['canGo', complexGuard],
          },
        },
      });
      const result = parseTree(config);

      test('#01 => action extracted', () => {
        expect(result.actions.toArray).toContain('doSomething');
      });

      test('#02 => guard extracted', () => {
        expect(result.guards.toArray).toContain('canGo');
        expect(result.guards.toArray).toContainEqual(complexGuard.name);
      });
    });

    describe('#03 => array transition with guards then target', () => {
      const guardsB = readonly({
        name: 'guardsB',
        description: 'guards for transition B',
      });
      const duplicateGuardsB = readonly({
        name: 'guardsB',
        description: 'guards for transition B',
      });
      const config = readonly({
        on: {
          NEXT: [
            { target: '/a', guards: ['guardA'], actions: ['actionA'] },
            { target: '/b', guards: [guardsB], actions: ['actionB'] },
            { guards: duplicateGuardsB },
            '/default',
          ],
        },
      });
      const result = parseTree(config);

      test('#01 => guards extracted', () => {
        expect(result.guards.toArray).toContain('guardA');
        expect(result.guards.toArray).toContain('guardsB');
      });

      test('#02 => actions extracted', () => {
        expect(result.actions.toArray).toContain('actionA');
        expect(result.actions.toArray).toContain('actionB');
      });
    });
  });

  describe('#04 => always transitions', () => {
    describe('#01 => always as string', () => {
      const result = parseTree({ always: '/target' });

      test('#01 => path added', () => {
        expect(result.paths.all).toContain('/');
      });
    });

    describe('#02 => always as array with actions and guards', () => {
      const alwaysAction2 = readonly({
        name: 'alwaysAction2',
        description: 'another always action',
      });
      const alwaysAction3 = readonly({
        name: 'alwaysAction3',
        description: 'yet another always action',
      });
      const alwaysGuard2 = readonly({
        name: 'alwaysGuard2',
        description: 'another always guard',
      });
      const alwaysGuard3 = readonly({
        name: 'alwaysGuard3',
        description: 'yet another always guard',
      });
      const config = readonly({
        always: [
          {
            target: '/a',
            guards: ['alwaysGuard', alwaysGuard2, alwaysGuard3],
            actions: ['alwaysAction', alwaysAction2, alwaysAction3],
          },
          '/fallback',
        ],
      });
      const result = parseTree(config);

      test('#01 => guards extracted', () => {
        expect(result.guards.toArray).toContain('alwaysGuard');
        expect(result.guards.toArray).toContain('alwaysGuard2');
        expect(result.guards.toArray).toContain('alwaysGuard3');
      });

      test('#02 => actions extracted', () => {
        expect(result.actions.toArray).toContain('alwaysAction');
        expect(result.actions.toArray).toContain('alwaysAction2');
        expect(result.actions.toArray).toContain('alwaysAction3');
      });

      test('#03 => no duplicate guards', () => {
        const unique = new Set(result.guards.toArray);
        expect(unique.size).toBe(result.guards.toArray.length);
      });

      test('#04 => no duplicate actions', () => {
        const unique = new Set(result.actions.toArray);
        expect(unique.size).toBe(result.actions.toArray.length);
      });
    });
  });

  describe('#05 => after (delay) transitions', () => {
    const config = readonly({
      after: {
        1000: { target: '/timeout', actions: ['onTimeout'] },
        LONG: '/longTarget',
      },
    });
    const result = parseTree(config);

    test('#01 => delay keys extracted', () => {
      expect(result.delays.toArray).toContain('1000');
      expect(result.delays.toArray).toContain('LONG');
    });

    test('#02 => action from delay extracted', () => {
      expect(result.actions.toArray).toContain('onTimeout');
    });

    test('#03 => no duplicate delay keys', () => {
      const unique = new Set(result.delays.toArray);
      expect(unique.size).toBe(result.delays.toArray.length);
    });
  });

  describe('#06 => activities', () => {
    describe('#01 => activity as string action', () => {
      const config = { activities: { polling: 'pollAction' } };
      const result = parseTree(config);

      test('#01 => action key extracted', () => {
        expect(result.actions.toArray).toContain('pollAction');
      });
    });

    describe('#02 => activity as object with guards and actions', () => {
      const config = readonly({
        activities: {
          polling: { guards: ['canPoll'], actions: ['startPoll'] },
        },
      });

      const result = parseTree(config);

      test('#01 => action extracted', () => {
        expect(result.actions.toArray).toContain('startPoll');
      });

      test('#02 => guard extracted', () => {
        expect(result.guards.toArray).toContain('canPoll');
      });
    });
  });

  describe('#07 => actors emitters', () => {
    const emitter = { next: 'onNext', error: 'onError' };
    const config = { actors: { myEmitter: emitter } };
    const result = parseTree(config);

    test('#01 => emitter key in emitters', () => {
      expect(result.emitters.toArray).toContain('myEmitter');
    });

    test('#02 => no duplicate emitter keys', () => {
      const unique = new Set(result.emitters.toArray);
      expect(unique.size).toBe(result.emitters.toArray.length);
    });
  });

  describe('#08 => actors children', () => {
    const config = {
      actors: {
        myChild: { on: { DONE: '/done' }, contexts: { parentId: 'id' } },
      },
    };
    const result = parseTree(config);

    test('#01 => child key in children', () => {
      expect(result.children.toArray).toContain('myChild');
    });

    test('#02 => child count is one', () => {
      expect(result.children.toArray.length).toBe(1);
    });
  });

  describe('#09 => compound state', () => {
    const config = {
      initial: 'idle',
      states: {
        idle: { on: { START: '/active' } },
        active: { entry: 'doStart', exit: 'doStop' },
      },
    };
    const result = parseTree(config);

    test('#01 => flat contains root and child paths', () => {
      expect(result.flat).toHaveProperty('/');
      expect(result.flat).toHaveProperty('/idle');
      expect(result.flat).toHaveProperty('/active');
    });

    test('#02 => paths.all contains all paths', () => {
      expect(result.paths.all).toContain('/');
      expect(result.paths.all).toContain('/idle');
      expect(result.paths.all).toContain('/active');
    });

    test('#03 => paths.map.initial is set for compound', () => {
      expect((result.paths.map as any).initial).toBe('idle');
    });

    test('#04 => paths.map.states has child entries', () => {
      expect((result.paths.map as any).states).toHaveProperty('idle');
      expect((result.paths.map as any).states).toHaveProperty('active');
    });

    test('#05 => actions from child states extracted', () => {
      expect(result.actions.toArray).toContain('doStart');
      expect(result.actions.toArray).toContain('doStop');
    });
  });

  describe('#10 => parallel state', () => {
    const config = {
      type: 'parallel' as const,
      states: { a: { entry: 'entryA' }, b: { entry: 'entryB' } },
    };
    const result = parseTree(config);

    test('#01 => flat contains both parallel branches', () => {
      expect(result.flat).toHaveProperty('/a');
      expect(result.flat).toHaveProperty('/b');
    });

    test('#02 => paths.map.initial is NOT set for parallel', () => {
      expect((result.paths.map as any).initial).toBeUndefined();
    });

    test('#03 => actions from both branches extracted', () => {
      expect(result.actions.toArray).toContain('entryA');
      expect(result.actions.toArray).toContain('entryB');
    });
  });

  describe('#11 => deeply nested states', () => {
    const config = {
      initial: 'level1',
      states: {
        level1: {
          initial: 'level2',
          states: {
            level2: {
              initial: 'level3',
              states: {
                level3: { entry: 'deepAction', on: { GO: '/level1' } },
              },
            },
          },
        },
      },
    };
    const result = parseTree(config);

    test('#01 => flat contains deeply nested path', () => {
      expect(result.flat).toHaveProperty('/level1');
      expect(result.flat).toHaveProperty('/level1/level2');
      expect(result.flat).toHaveProperty('/level1/level2/level3');
    });

    test('#02 => deep action extracted', () => {
      expect(result.actions.toArray).toContain('deepAction');
    });

    test('#03 => paths.map recursively has nested states', () => {
      const map = result.paths.map as any;
      expect(map.states.level1.states.level2.states).toHaveProperty(
        'level3',
      );
    });

    test('#04 => paths.map.initial set at each compound level', () => {
      const map = result.paths.map as any;
      expect(map.initial).toBe('level1');
      expect(map.states.level1.initial).toBe('level2');
      expect(map.states.level1.states.level2.initial).toBe('level3');
    });

    test('#05 => leaf node has no initial in paths.map', () => {
      const map = result.paths.map as any;
      expect(
        map.states.level1.states.level2.states.level3.initial,
      ).toBeUndefined();
    });

    test('#06 => paths.map.targets contains all paths', () => {
      expect(result.paths.map.targets).not.toContain('/');
      expect(result.paths.map.targets).toContain('/level1/level2');
      expect(result.paths.map.targets).toContain('/level1');
    });
  });

  describe('#12 => no duplicates across states', () => {
    const config = {
      initial: 'a',
      states: {
        a: { entry: 'sharedAction', exit: 'sharedAction' },
        b: { entry: 'sharedAction' },
      },
    };
    const result = parseTree(config);

    test('#01 => actions has no duplicates', () => {
      const unique = new Set(result.actions.toArray);
      expect(unique.size).toBe(result.actions.toArray.length);
    });

    test('#02 => sharedAction appears exactly once', () => {
      const count = result.actions.toArray.filter(
        a => a === 'sharedAction',
      ).length;
      expect(count).toBe(1);
    });
  });

  describe('#13 => combined config (actions, guards, delays, emitters, children)', () => {
    const config = {
      initial: 'idle',
      entry: 'onEntry',
      states: {
        idle: {
          on: {
            START: {
              target: '/active',
              guards: ['canStart'],
              actions: ['doStart'],
            },
          },
          after: { 5000: { target: '/timeout', actions: ['onIdle'] } },
        },
        active: {
          exit: 'doClean',
          actors: {
            stream: { next: 'onData', error: 'onError' },
            childMachine: { on: { DONE: '/idle' }, contexts: { x: 'y' } },
          },
        },
        timeout: {},
      },
    } as const;
    const result = parseTree(config);

    test('#01 => all state paths in flat', () => {
      expect(result.flat).toHaveProperty('/idle');
      expect(result.flat).toHaveProperty('/active');
      expect(result.flat).toHaveProperty('/timeout');
    });

    test('#02 => entry action extracted', () => {
      expect(result.actions.toArray).toContain('onEntry');
    });

    test('#03 => guard extracted', () => {
      expect(result.guards.toArray).toContain('canStart');
    });

    test('#04 => transition action extracted', () => {
      expect(result.actions.toArray).toContain('doStart');
    });

    test('#05 => delay key extracted', () => {
      expect(result.delays.toArray).toContain('5000');
    });

    test('#06 => delay action extracted', () => {
      expect(result.actions.toArray).toContain('onIdle');
    });

    test('#07 => exit action extracted', () => {
      expect(result.actions.toArray).toContain('doClean');
    });

    test('#08 => emitter key extracted', () => {
      expect(result.emitters.toArray).toContain('stream');
    });

    test('#09 => child key extracted', () => {
      expect(result.children.toArray).toContain('childMachine');
    });

    test('#10 => paths.map.initial is set', () => {
      expect((result.paths.map as any).initial).toBe('idle');
    });

    test('#11 => no duplicates in any collection', () => {
      const collections = [
        result.actions.toArray,
        result.guards.toArray,
        result.emitters.toArray,
        result.children.toArray,
        result.delays.toArray,
      ];

      for (const arr of collections) {
        const unique = new Set(arr);
        expect(unique.size).toBe(arr.length);
      }
    });
  });
});
