import { readonly } from '@bemedev/app/utils';
import { parseTree } from './parseTree';

describe('#01 => parseTree', () => {
  describe('#01 => atomic node (no states)', () => {
    const config = readonly({ type: 'atomic' });
    const result = parseTree(config);

    test('#01 => flat contains only root', () => {
      expect(Object.keys(result.flat)).toEqual(['/']);
    });

    test('#02 => empty __config is empty object', () => {
      expect(parseTree({}).__config).toEqual({});
    });

    test('#03 => __config is original config', () => {
      expect(result.__config).toBe(config);
    });

    test('#04 => actions is empty', () => {
      expect(result.actions.toArray).toEqual([]);
    });

    test('#05 => guards is empty', () => {
      expect(result.guards.toArray).toEqual([]);
    });

    test('#06 => emitters is empty', () => {
      expect(result.emitters.toArray).toEqual([]);
    });

    test('#07 => children is empty', () => {
      expect(result.children.toArray).toEqual([]);
    });

    test('#08 => delays is empty', () => {
      expect(result.delays.toArray).toEqual([]);
    });

    test('#09 => paths.all contains root', () => {
      expect(result.paths.all).toContain('/');
    });

    test('#10 => paths.map.targets contains root path', () => {
      expect(result.paths.map.targets).toEqual([]);
    });

    test('#11 => allPaths is empty', () => {
      expect(result.allPaths.toArray).toContain('/');
    });

    test('#12 => targets is empty', () => {
      expect(result.targets.toArray).toEqual([]);
    });

    test('#13 => events is empty', () => {
      expect(result.events.toArray).toEqual([]);
    });

    test('#14 => tags is empty', () =>
      expect(result.tags.toArray).toEqual([]));
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

    test('#01 => first entry action in actions', () => {
      expect(result.actions.toArray).toContain('entryAction1');
    });

    test('#02 => second entry action in actions', () => {
      expect(result.actions.toArray).toContain('entryAction2');
    });

    test('#03 => exit action in actions', () => {
      expect(result.actions.toArray).toContain('exitAction1');
    });

    test('#04 => no duplicate actions', () => {
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

      test('#02 => string guard extracted', () => {
        expect(result.guards.toArray).toContain('canGo');
      });

      test('#03 => complex guard extracted', () => {
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

      test('#01 => guardA extracted', () => {
        expect(result.guards.toArray).toContain('guardA');
      });

      test('#02 => guardsB extracted', () => {
        expect(result.guards.toArray).toContain('guardsB');
      });

      test('#03 => actionA extracted', () => {
        expect(result.actions.toArray).toContain('actionA');
      });

      test('#04 => actionB extracted', () => {
        expect(result.actions.toArray).toContain('actionB');
      });
    });
  });

  describe('#04 => always transitions', () => {
    test('#01 => always as string adds path', () => {
      expect(parseTree({ always: '/target' }).paths.all).toContain('/');
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

      test('#01 => first guard extracted', () => {
        expect(result.guards.toArray).toContain('alwaysGuard');
      });

      test('#02 => second guard extracted', () => {
        expect(result.guards.toArray).toContain('alwaysGuard2');
      });

      test('#03 => third guard extracted', () => {
        expect(result.guards.toArray).toContain('alwaysGuard3');
      });

      test('#04 => first action extracted', () => {
        expect(result.actions.toArray).toContain('alwaysAction');
      });

      test('#05 => second action extracted', () => {
        expect(result.actions.toArray).toContain('alwaysAction2');
      });

      test('#06 => third action extracted', () => {
        expect(result.actions.toArray).toContain('alwaysAction3');
      });

      test('#07 => no duplicate guards', () => {
        const unique = new Set(result.guards.toArray);
        expect(unique.size).toBe(result.guards.toArray.length);
      });

      test('#08 => no duplicate actions', () => {
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

    test('#01 => 1000 delay key extracted', () => {
      expect(result.delays.toArray).toContain('1000');
    });

    test('#02 => LONG delay key extracted', () => {
      expect(result.delays.toArray).toContain('LONG');
    });

    test('#03 => action from delay extracted', () => {
      expect(result.actions.toArray).toContain('onTimeout');
    });

    test('#04 => no duplicate delay keys', () => {
      const unique = new Set(result.delays.toArray);
      expect(unique.size).toBe(result.delays.toArray.length);
    });
  });

  describe('#06 => activities', () => {
    test('#01 => activity as string action extracts action key', () => {
      expect(
        parseTree({ activities: { polling: 'pollAction' } }).actions
          .toArray,
      ).toContain('pollAction');
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

    test('#01 => flat contains root path', () => {
      expect(result.flat).toHaveProperty('/');
    });

    test('#02 => flat contains idle path', () => {
      expect(result.flat).toHaveProperty('/idle');
    });

    test('#03 => flat contains active path', () => {
      expect(result.flat).toHaveProperty('/active');
    });

    test('#04 => paths.all contains root path', () => {
      expect(result.paths.all).toContain('/');
    });

    test('#05 => paths.all contains idle path', () => {
      expect(result.paths.all).toContain('/idle');
    });

    test('#06 => paths.all contains active path', () => {
      expect(result.paths.all).toContain('/active');
    });

    test('#07 => paths.map.initial is set for compound', () => {
      expect((result.paths.map as any).initial).toBe('idle');
    });

    test('#08 => paths.map.states has idle entry', () => {
      expect((result.paths.map as any).states).toHaveProperty('idle');
    });

    test('#09 => paths.map.states has active entry', () => {
      expect((result.paths.map as any).states).toHaveProperty('active');
    });

    test('#10 => entry action from child state extracted', () => {
      expect(result.actions.toArray).toContain('doStart');
    });

    test('#11 => exit action from child state extracted', () => {
      expect(result.actions.toArray).toContain('doStop');
    });
  });

  describe('#10 => parallel state', () => {
    const config = {
      type: 'parallel' as const,
      states: { a: { entry: 'entryA' }, b: { entry: 'entryB' } },
    };
    const result = parseTree(config);

    test('#01 => flat contains first parallel branch', () => {
      expect(result.flat).toHaveProperty('/a');
    });

    test('#02 => flat contains second parallel branch', () => {
      expect(result.flat).toHaveProperty('/b');
    });

    test('#03 => paths.map.initial is NOT set for parallel', () => {
      expect((result.paths.map as any).initial).toBeUndefined();
    });

    test('#04 => action from first branch extracted', () => {
      expect(result.actions.toArray).toContain('entryA');
    });

    test('#05 => action from second branch extracted', () => {
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

    test('#01 => flat contains level1 path', () => {
      expect(result.flat).toHaveProperty('/level1');
    });

    test('#02 => flat contains level2 path', () => {
      expect(result.flat).toHaveProperty('/level1/level2');
    });

    test('#03 => flat contains level3 path', () => {
      expect(result.flat).toHaveProperty('/level1/level2/level3');
    });

    test('#04 => deep action extracted', () => {
      expect(result.actions.toArray).toContain('deepAction');
    });

    test('#05 => paths.map recursively has nested states', () => {
      const map = result.paths.map as any;
      expect(map.states.level1.states.level2.states).toHaveProperty(
        'level3',
      );
    });

    test('#06 => paths.map.initial set at root level', () => {
      const map = result.paths.map as any;
      expect(map.initial).toBe('level1');
    });

    test('#07 => paths.map.initial set at level1', () => {
      const map = result.paths.map as any;
      expect(map.states.level1.initial).toBe('level2');
    });

    test('#08 => paths.map.initial set at level2', () => {
      const map = result.paths.map as any;
      expect(map.states.level1.states.level2.initial).toBe('level3');
    });

    test('#09 => leaf node has no initial in paths.map', () => {
      const map = result.paths.map as any;
      expect(
        map.states.level1.states.level2.states.level3.initial,
      ).toBeUndefined();
    });

    test('#10 => paths.map.targets does not contain root', () => {
      expect(result.paths.map.targets).not.toContain('/');
    });

    test('#11 => paths.map.targets contains level2 path', () => {
      expect(result.paths.map.targets).toContain('/level1/level2');
    });

    test('#12 => paths.map.targets contains level1 path', () => {
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

    test('#01 => idle state path in flat', () => {
      expect(result.flat).toHaveProperty('/idle');
    });

    test('#02 => active state path in flat', () => {
      expect(result.flat).toHaveProperty('/active');
    });

    test('#03 => timeout state path in flat', () => {
      expect(result.flat).toHaveProperty('/timeout');
    });

    test('#04 => entry action extracted', () => {
      expect(result.actions.toArray).toContain('onEntry');
    });

    test('#05 => guard extracted', () => {
      expect(result.guards.toArray).toContain('canStart');
    });

    test('#06 => transition action extracted', () => {
      expect(result.actions.toArray).toContain('doStart');
    });

    test('#07 => delay key extracted', () => {
      expect(result.delays.toArray).toContain('5000');
    });

    test('#08 => delay action extracted', () => {
      expect(result.actions.toArray).toContain('onIdle');
    });

    test('#09 => exit action extracted', () => {
      expect(result.actions.toArray).toContain('doClean');
    });

    test('#10 => emitter key extracted', () => {
      expect(result.emitters.toArray).toContain('stream');
    });

    test('#11 => child key extracted', () => {
      expect(result.children.toArray).toContain('childMachine');
    });

    test('#12 => paths.map.initial is set', () => {
      expect((result.paths.map as any).initial).toBe('idle');
    });

    test('#13 => no duplicates in any collection', () => {
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
