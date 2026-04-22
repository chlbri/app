import { readonly } from '#utils';
import { parseTree } from './parseTree';

describe('#01 => parseTree', () => {
  // #region atomic
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

    test('#03 => keys.actions is empty', () => {
      expect(result.keys.actions).toEqual([]);
    });

    test('#04 => keys.guards is empty', () => {
      expect(result.keys.guards).toEqual([]);
    });

    test('#05 => keys.emitters is empty', () => {
      expect(result.keys.emitters).toEqual([]);
    });

    test('#06 => keys.children is empty', () => {
      expect(result.keys.children).toEqual([]);
    });

    test('#07 => keys.delays is empty', () => {
      expect(result.keys.delays).toEqual([]);
    });

    test('#08 => keys.paths.all contains root', () => {
      expect(result.keys.paths.all).toContain('/');
    });

    test('#09 => keys.paths.map.targets contains root path', () => {
      expect(result.keys.paths.map.targets).toContain('/');
    });

    test('#10 => actions is empty', () => {
      expect(result.actions).toEqual([]);
    });

    test('#11 => guards is empty', () => {
      expect(result.guards).toEqual([]);
    });

    test('#12 => emitters is empty', () => {
      expect(result.emitters).toEqual([]);
    });

    test('#13 => children is empty', () => {
      expect(result.children).toEqual([]);
    });

    test('#14 => delays is empty', () => {
      expect(result.delays).toEqual([]);
    });
  });
  // #endregion

  // #region entry/exit actions
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

    test('#01 => entry actions in keys.actions', () => {
      expect(result.keys.actions).toContain('entryAction1');
      expect(result.keys.actions).toContain('entryAction2');
    });

    test('#02 => exit action in keys.actions', () => {
      expect(result.keys.actions).toContain('exitAction1');
    });

    test('#03 => entry actions in actions array', () => {
      expect(result.actions).toContain('entryAction1');
      expect(result.actions).toContainEqual(compositeAction);
    });

    test('#04 => exit action in actions array', () => {
      expect(result.actions).toContain('exitAction1');
    });

    test('#05 => no duplicate keys', () => {
      const unique = new Set(result.keys.actions);
      expect(unique.size).toBe(result.keys.actions.length);
    });

    test('#06 => no duplicate actions', () => {
      const unique = new Set(result.actions);
      expect(unique.size).toBe(result.actions.length);
    });
  });
  // #endregion

  // #region on transitions
  describe('#03 => on transitions', () => {
    describe('#01 => string target', () => {
      const config = { on: { NEXT: '/child' } };
      const result = parseTree(config);

      test('#01 => path added', () => {
        expect(result.keys.paths.all).toContain('/');
      });

      test('#02 => no actions extracted', () => {
        expect(result.actions).toEqual([]);
      });
    });

    describe('#02 => transition object with actions and guards', () => {
      const complexGuard = readonly({
        name: 'complexGuard',
        description: 'a complex guard',
      });
      const config = readonly({
        on: {
          NEXT: {
            target: '/child',
            actions: ['doSomething'],
            guards: ['canGo', complexGuard],
          },
        },
      });
      const result = parseTree(config);

      test('#01 => action key extracted', () => {
        expect(result.keys.actions).toContain('doSomething');
      });

      test('#02 => guard key extracted', () => {
        expect(result.keys.guards).toContain('canGo');
        expect(result.keys.guards).toContain('complexGuard');
      });

      test('#03 => action in actions array', () => {
        expect(result.actions).toContain('doSomething');
      });

      test('#04 => guard in guards array', () => {
        expect(result.guards).toContain('canGo');
        expect(result.guards).toContainEqual(complexGuard);
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

      test('#01 => guard key extracted', () => {
        expect(result.keys.guards).toContain('guardA');
        expect(result.keys.guards).toContain('guardsB');
      });

      test('#02 => action key extracted', () => {
        expect(result.keys.actions).toContain('actionA');
      });
    });
  });
  // #endregion

  // #region always transitions
  describe('#04 => always transitions', () => {
    describe('#01 => always as string', () => {
      const config = { always: '/target' };
      const result = parseTree(config);

      test('#01 => "always" in paths', () => {
        expect(result.keys.paths.all).toContain('/');
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

      test('#01 => guard key extracted', () => {
        expect(result.keys.guards).toContain('alwaysGuard');
        expect(result.keys.guards).toContain('alwaysGuard2');
        expect(result.keys.guards).toContain('alwaysGuard3');
      });

      test('#02 => action key extracted', () => {
        expect(result.keys.actions).toContain('alwaysAction');
        expect(result.keys.actions).toContain('alwaysAction2');
        expect(result.keys.actions).toContain('alwaysAction3');
      });

      test('#03 => guard in guards array', () => {
        expect(result.guards).toContain('alwaysGuard');
        expect(result.guards).toContainEqual(alwaysGuard2);
        expect(result.guards).toContainEqual(alwaysGuard3);
      });

      test('#04 => action in actions array', () => {
        expect(result.actions).toContain('alwaysAction');
        expect(result.actions).toContainEqual(alwaysAction2);
        expect(result.actions).toContainEqual(alwaysAction3);
      });
    });
  });
  // #endregion

  // #region after (delays)
  describe('#05 => after (delay) transitions', () => {
    const config = readonly({
      after: {
        1000: { target: '/timeout', actions: ['onTimeout'] },
        LONG: '/longTarget',
      },
    });
    const result = parseTree(config);

    test('#01 => delay keys extracted', () => {
      expect(result.keys.delays).toContain('1000');
      expect(result.keys.delays).toContain('LONG');
    });

    test('#02 => action from delay extracted', () => {
      expect(result.keys.actions).toContain('onTimeout');
    });

    test('#03 => no duplicate delay keys', () => {
      const unique = new Set(result.keys.delays);
      expect(unique.size).toBe(result.keys.delays.length);
    });
  });
  // #endregion

  // #region activities
  describe('#06 => activities', () => {
    describe('#01 => activity as string action', () => {
      const config = {
        activities: { polling: 'pollAction' },
      };
      const result = parseTree(config);

      test('#01 => action key extracted', () => {
        expect(result.keys.actions).toContain('pollAction');
      });
    });

    describe('#02 => activity as object with guards and actions', () => {
      const config = readonly({
        activities: {
          polling: {
            guards: ['canPoll'],
            actions: ['startPoll'],
          },
        },
      });

      const result = parseTree(config);

      test('#01 => action key extracted', () => {
        expect(result.keys.actions).toContain('startPoll');
      });

      test('#02 => guard key extracted', () => {
        expect(result.keys.guards).toContain('canPoll');
      });
    });
  });
  // #endregion

  // #region actors: emitters
  describe('#07 => actors emitters', () => {
    const emitter = { next: 'onNext', error: 'onError' };
    const config = { actors: { myEmitter: emitter } };
    const result = parseTree(config);

    test('#01 => emitter key in keys.emitters', () => {
      expect(result.keys.emitters).toContain('myEmitter');
    });

    test('#02 => emitter in emitters array', () => {
      expect(result.emitters).toContain(emitter);
    });

    test('#03 => no duplicate emitter keys', () => {
      const unique = new Set(result.keys.emitters);
      expect(unique.size).toBe(result.keys.emitters.length);
    });
  });
  // #endregion

  // #region actors: children
  describe('#08 => actors children', () => {
    const config = {
      actors: {
        myChild: {
          on: { DONE: '/done' },
          contexts: { parentId: 'id' },
        },
      },
    };
    const result = parseTree(config);

    test('#01 => child key in keys.children', () => {
      expect(result.keys.children).toContain('myChild');
    });

    test('#02 => child in children array', () => {
      expect(result.children.length).toBe(1);
    });

    test('#03 => child.on is entries array', () => {
      expect(result.children[0].on).toEqual([['DONE', '/done']]);
    });

    test('#04 => child.contexts is entries array', () => {
      expect(result.children[0].contexts).toEqual([['parentId', 'id']]);
    });
  });
  // #endregion

  // #region compound state
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

    test('#02 => keys.paths.all contains all paths', () => {
      expect(result.keys.paths.all).toContain('/');
      expect(result.keys.paths.all).toContain('/idle');
      expect(result.keys.paths.all).toContain('/active');
    });

    test('#03 => paths.map.initial is set for compound', () => {
      expect((result.keys.paths.map as any).initial).toBe('idle');
    });

    test('#04 => paths.map.states has child entries', () => {
      expect((result.keys.paths.map as any).states).toHaveProperty('idle');
      expect((result.keys.paths.map as any).states).toHaveProperty(
        'active',
      );
    });

    test('#05 => actions from child states extracted', () => {
      expect(result.keys.actions).toContain('doStart');
      expect(result.keys.actions).toContain('doStop');
    });
  });
  // #endregion

  // #region parallel state
  describe('#10 => parallel state', () => {
    const config = {
      type: 'parallel' as const,
      states: {
        a: { entry: 'entryA' },
        b: { entry: 'entryB' },
      },
    };
    const result = parseTree(config);

    test('#01 => flat contains both parallel branches', () => {
      expect(result.flat).toHaveProperty('/a');
      expect(result.flat).toHaveProperty('/b');
    });

    test('#02 => paths.map.initial is NOT set for parallel', () => {
      expect((result.keys.paths.map as any).initial).toBeUndefined();
    });

    test('#03 => actions from both branches extracted', () => {
      expect(result.keys.actions).toContain('entryA');
      expect(result.keys.actions).toContain('entryB');
    });
  });
  // #endregion

  // #region recursive (deeply nested)
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
      expect(result.keys.actions).toContain('deepAction');
    });

    test('#03 => paths.map recursively has nested states', () => {
      const map = result.keys.paths.map as any;
      expect(map.states.level1.states.level2.states).toHaveProperty(
        'level3',
      );
    });

    test('#04 => paths.map.initial set at each compound level', () => {
      const map = result.keys.paths.map as any;
      expect(map.initial).toBe('level1');
      expect(map.states.level1.initial).toBe('level2');
      expect(map.states.level1.states.level2.initial).toBe('level3');
    });

    test('#05 => leaf node has no initial in paths.map', () => {
      const map = result.keys.paths.map as any;
      expect(
        map.states.level1.states.level2.states.level3.initial,
      ).toBeUndefined();
    });

    test('#06 => paths.map.targets contains all paths', () => {
      expect(result.keys.paths.map.targets).toContain('/');
      expect(result.keys.paths.map.targets).toContain('/level1');
    });
  });
  // #endregion

  // #region no duplicates
  describe('#12 => no duplicates across states', () => {
    const config = {
      initial: 'a',
      states: {
        a: { entry: 'sharedAction', exit: 'sharedAction' },
        b: { entry: 'sharedAction' },
      },
    };
    const result = parseTree(config);

    test('#01 => keys.actions has no duplicates', () => {
      const unique = new Set(result.keys.actions);
      expect(unique.size).toBe(result.keys.actions.length);
    });

    test('#02 => actions array has no duplicates', () => {
      const unique = new Set(result.actions);
      expect(unique.size).toBe(result.actions.length);
    });

    test('#03 => sharedAction appears exactly once in keys', () => {
      const count = result.keys.actions.filter(
        k => k === 'sharedAction',
      ).length;
      expect(count).toBe(1);
    });

    test('#04 => sharedAction appears exactly once in actions', () => {
      const count = result.actions.filter(
        a => a === 'sharedAction',
      ).length;
      expect(count).toBe(1);
    });
  });
  // #endregion

  // #region combined
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
      expect(result.keys.actions).toContain('onEntry');
    });

    test('#03 => guard key extracted', () => {
      expect(result.keys.guards).toContain('canStart');
    });

    test('#04 => transition action extracted', () => {
      expect(result.keys.actions).toContain('doStart');
    });

    test('#05 => delay key extracted', () => {
      expect(result.keys.delays).toContain('5000');
    });

    test('#06 => delay action extracted', () => {
      expect(result.keys.actions).toContain('onIdle');
    });

    test('#07 => exit action extracted', () => {
      expect(result.keys.actions).toContain('doClean');
    });

    test('#08 => emitter key extracted', () => {
      expect(result.keys.emitters).toContain('stream');
    });

    test('#09 => child key extracted', () => {
      expect(result.keys.children).toContain('childMachine');
    });

    test('#10 => paths.map.initial is set', () => {
      expect((result.keys.paths.map as any).initial).toBe('idle');
    });

    test('#11 => no duplicates in any array', () => {
      for (const arr of [
        result.keys.actions,
        result.keys.guards,
        result.keys.emitters,
        result.keys.children,
        result.keys.delays,
        result.actions,
        result.guards,
      ]) {
        const unique = new Set(arr);
        expect(unique.size).toBe(arr.length);
      }
    });
  });
  // #endregion
});
