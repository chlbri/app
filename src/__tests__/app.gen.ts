import type { MachineEntry } from '#machines';

declare module '../index' {
  interface Register {
    // ── actions ────────────────────────────────────────────────────────────
    'src/__tests__/actions/action.batch.cov.machine': MachineEntry<
      'INC1' | 'INC2' | 'INC5'
    >;
    'src/__tests__/actions/actions.1.machine': MachineEntry<'NEXT'>;
    'src/__tests__/actions/actions.2.machine': MachineEntry<'NEXT'>;
    'src/__tests__/actions/async-actions.1.machine': MachineEntry<'LOAD'>;
    'src/__tests__/actions/async-actions.2.machine': MachineEntry<'LOAD'>;
    'src/__tests__/actions/async-actions.3.machine': MachineEntry<'LOAD'>;
    'src/__tests__/actions/async-actions.4.machine': MachineEntry<'PING'>;
    'src/__tests__/actions/async-actions.5.machine': MachineEntry<'PING'>;
    'src/__tests__/actions/async-actions.6.machine': MachineEntry<'FILTER'>;
    'src/__tests__/actions/async-actions.7.machine': MachineEntry<'DISPATCH'>;
    'src/__tests__/actions/async-actions.8.machine': MachineEntry<'INC'>;
    'src/__tests__/actions/sendToActions/sendToActions1.machine': MachineEntry<
      | 'DECREMENT'
      | 'REDECREMENT'
      | 'INCREMENT'
      | 'INCREMENT.FORCE'
      | 'NEXT'
    >;
    'src/__tests__/actions/sendToActions/sendToActions2.machine': MachineEntry<
      | 'DECREMENT'
      | 'REDECREMENT'
      | 'INCREMENT'
      | 'INCREMENT.FORCE'
      | 'NEXT'
    >;

    // ── delays ─────────────────────────────────────────────────────────────
    'src/__tests__/delays/delay.notDefined.machine': MachineEntry;
    'src/__tests__/delays/fixtures': MachineEntry<'NEXT'>;

    // ── emitters ───────────────────────────────────────────────────────────
    'src/__tests__/emitters/data': MachineEntry<'NEXT', never, 'interval'>;
    'src/__tests__/emitters/data._2': MachineEntry<
      'NEXT',
      never,
      'interval1'
    >;
    'src/__tests__/emitters/error.machine': MachineEntry<
      never,
      never,
      'interval'
    >;

    // ── guards ─────────────────────────────────────────────────────────────
    'src/__tests__/guards/index.1.machine': MachineEntry;
    'src/__tests__/guards/index.2.machine': MachineEntry<'NEXT'>;
    'src/__tests__/guards/index.3.machine': MachineEntry<'NEXT'>;
    'src/__tests__/guards/index.4.machine': MachineEntry<
      never,
      never,
      never,
      { data: string }
    >;

    // ── interpreters / activities ───────────────────────────────────────────
    'src/__tests__/interpreters/activities/constants': MachineEntry<'NEXT'>;
    'src/__tests__/interpreters/activities/pause.machine': MachineEntry<
      'PAUSE' | 'RESUME' | 'STOP' | 'NEXT'
    >;
    'src/__tests__/interpreters/activities/perform.bis.machine': MachineEntry<
      | 'DECREMENT'
      | 'REDECREMENT'
      | 'INCREMENT'
      | 'INCREMENT.FORCE'
      | 'NEXT'
    >;
    'src/__tests__/interpreters/activities/perform.machine': MachineEntry<
      'PAUSE' | 'RESUME' | 'STOP'
    >;

    // ── interpreters / children ─────────────────────────────────────────────
    'src/__tests__/interpreters/children.1.machine': MachineEntry;
    'src/__tests__/interpreters/children.2.machine': MachineEntry<
      string,
      'child',
      never,
      number
    >;
    'src/__tests__/interpreters/children.3.machine': MachineEntry<
      'NEXT',
      'child',
      never,
      { iterator: number }
    >;
    'src/__tests__/interpreters/children.4.machine': MachineEntry<'NEXT'>;
    'src/__tests__/interpreters/children.5.machine': MachineEntry<
      'NEXT',
      'child'
    >;

    // ── interpreters / complex ──────────────────────────────────────────────
    'src/__tests__/interpreters/complex/machine1.machine': MachineEntry<
      'START' | 'ADD_INTERMEDIARY' | 'RESET',
      never,
      never,
      undefined,
      'un' | 'deux'
    >;

    // ── interpreters / composition ──────────────────────────────────────────
    'src/__tests__/interpreters/composition.1.machine': MachineEntry<
      'ADD_CONDITION' | 'REMOVE_CONDITION'
    >;
    'src/__tests__/interpreters/composition.2.machine': MachineEntry<'NEXT'>;
    'src/__tests__/interpreters/composition.3.machine': MachineEntry;
    'src/__tests__/interpreters/composition.4.machine': MachineEntry;

    // ── interpreters / coverage / actors ───────────────────────────────────
    'src/__tests__/interpreters/coverage/actors/2ids.1.machine': MachineEntry;
    'src/__tests__/interpreters/coverage/actors/2ids.2.machine': MachineEntry<
      'NEXT',
      'child1' | 'child2',
      never,
      {
        iter1: any;
        iter2: any;
        all: any;
      }
    >;
    'src/__tests__/interpreters/coverage/actors/child.1.machine': MachineEntry;
    'src/__tests__/interpreters/coverage/actors/child.2.machine': MachineEntry<
      'NEXT',
      'child',
      never,
      {
        iter1: any;
        iter2: any;
        all: any;
      }
    >;
    'src/__tests__/interpreters/coverage/actors/emitter.machine': MachineEntry<
      'NEXT',
      never,
      'interval'
    >;

    // ── interpreters / coverage ─────────────────────────────────────────────
    'src/__tests__/interpreters/coverage/addOptions-return.1.machine': MachineEntry<'INCREMENT'>;
    'src/__tests__/interpreters/coverage/addOptions-return.2.machine': MachineEntry;
    'src/__tests__/interpreters/coverage/addOptions-return.3.machine': MachineEntry<'CHECK'>;
    'src/__tests__/interpreters/coverage/addOptions-return.4.machine': MachineEntry<'INCREMENT'>;
    'src/__tests__/interpreters/coverage/addOptions-return.5.machine': MachineEntry<
      'FIRST' | 'SECOND'
    >;
    'src/__tests__/interpreters/coverage/index.machine': MachineEntry<
      'INC' | 'INC.PRIVATE' | 'NEXT',
      never,
      never,
      number
    >;

    // ── interpreters / data ─────────────────────────────────────────────────
    'src/__tests__/interpreters/data/machine1': MachineEntry<'NEXT'>;
    'src/__tests__/interpreters/data/machine2': MachineEntry<
      'NEXT' | 'FETCH' | 'WRITE' | 'FINISH',
      'machine1',
      never,
      { iterator: number }
    >;
    'src/__tests__/interpreters/data/machine2._2': MachineEntry<
      'NEXT' | 'FETCH' | 'WRITE' | 'FINISH',
      'machine1',
      never,
      { iterator: number }
    >;
    'src/__tests__/interpreters/data/machine21': MachineEntry<
      'NEXT' | 'FETCH' | 'WRITE' | 'SEND',
      'machine1',
      never,
      { iterator: number }
    >;
    'src/__tests__/interpreters/data/machine23': MachineEntry<
      'NEXT' | 'FETCH' | 'WRITE' | 'FINISH',
      'machine1',
      never,
      { iterator: number }
    >;
    'src/__tests__/interpreters/data/machine3': MachineEntry<
      'EVENT' | 'EVENT2' | 'EVENT3',
      'machine1',
      never,
      { data: string }
    >;

    // ── interpreters / filter-erase ─────────────────────────────────────────
    'src/__tests__/interpreters/filter-erase.1.machine': MachineEntry<
      'ADD' | 'FILTER' | 'RESET'
    >;
    'src/__tests__/interpreters/filter-erase.2.machine': MachineEntry<
      'ADD_PEOPLE' | 'FILTER_ACTIVE'
    >;
    'src/__tests__/interpreters/filter-erase.3.machine': MachineEntry<
      'SET_SCORES' | 'FILTER_HIGH_SCORES'
    >;
    'src/__tests__/interpreters/filter-erase.4.machine': MachineEntry<
      'SET_NAME' | 'CLEAR_NAME'
    >;
    'src/__tests__/interpreters/filter-erase.5.machine': MachineEntry<
      'SET_USER' | 'CLEAR_EMAIL'
    >;
    'src/__tests__/interpreters/filter-erase.6.machine': MachineEntry<
      'SET_DATA' | 'CLEAR_ALL'
    >;

    // ── interpreters / legacy-options ───────────────────────────────────────
    'src/__tests__/interpreters/legacy-options.1.machine': MachineEntry<
      'NEXT' | 'DOUBLE'
    >;
    'src/__tests__/interpreters/legacy-options.2.machine': MachineEntry<'NEXT'>;
    'src/__tests__/interpreters/legacy-options.3.machine': MachineEntry<'CHECK'>;
    'src/__tests__/interpreters/legacy-options.4.machine': MachineEntry<
      'ADD' | 'MULTIPLY'
    >;
    'src/__tests__/interpreters/legacy-options.5.machine': MachineEntry;
    'src/__tests__/interpreters/legacy-options.6.machine': MachineEntry<
      'FIRST' | 'SECOND' | 'THIRD'
    >;
    'src/__tests__/interpreters/legacy-options.7.machine': MachineEntry<
      'NEXT' | 'TRIPLE'
    >;
    'src/__tests__/interpreters/legacy-options.8.machine': MachineEntry<'NEXT'>;
    'src/__tests__/interpreters/legacy-options.9.machine': MachineEntry<'CHECK'>;
    'src/__tests__/interpreters/legacy-options.10.machine': MachineEntry<
      'FIRST' | 'SECOND'
    >;
    'src/__tests__/interpreters/legacy-options.11.machine': MachineEntry<
      'ADD' | 'MULTIPLY'
    >;
    'src/__tests__/interpreters/legacy-options.12.machine': MachineEntry<'INCREMENT'>;
    'src/__tests__/interpreters/legacy-options.13.machine': MachineEntry<
      'OP1' | 'OP2' | 'OP3'
    >;
    'src/__tests__/interpreters/legacy-options.14.machine': MachineEntry<'INCREMENT'>;

    // ── interpreters / selftransitions ──────────────────────────────────────
    'src/__tests__/interpreters/selftransitions/after.1.machine': MachineEntry;
    'src/__tests__/interpreters/selftransitions/after.2.machine': MachineEntry;
    'src/__tests__/interpreters/selftransitions/after.3.machine': MachineEntry;
    'src/__tests__/interpreters/selftransitions/after.4.machine': MachineEntry<'NEXT'>;
    'src/__tests__/interpreters/selftransitions/after.5.machine': MachineEntry;
    'src/__tests__/interpreters/selftransitions/always.1.machine': MachineEntry;
    'src/__tests__/interpreters/selftransitions/always.2.machine': MachineEntry;
    'src/__tests__/interpreters/selftransitions/always.3.machine': MachineEntry;
    'src/__tests__/interpreters/selftransitions/index.1.machine': MachineEntry;
    'src/__tests__/interpreters/selftransitions/index.2.machine': MachineEntry;

    // ── interpreters / tags ─────────────────────────────────────────────────
    'src/__tests__/interpreters/tags/tags.machine': MachineEntry<
      'NEXT' | 'PREV',
      never,
      never,
      undefined,
      'idle' | 'working' | 'busy'
    >;

    // ── machine ─────────────────────────────────────────────────────────────
    'src/__tests__/machine/addOptions-return.1.machine': MachineEntry<'INCREMENT'>;
    'src/__tests__/machine/addOptions-return.2.machine': MachineEntry;
    'src/__tests__/machine/addOptions-return.3.machine': MachineEntry<'CHECK'>;
    'src/__tests__/machine/addOptions-return.4.machine': MachineEntry<'INCREMENT'>;
    'src/__tests__/machine/asyncActions.1.machine': MachineEntry<'TEST'>;
    'src/__tests__/machine/asyncActions.2.machine': MachineEntry<'TEST'>;
    'src/__tests__/machine/asyncActions.3.machine': MachineEntry<'TEST'>;
    'src/__tests__/machine/asyncActions.4.machine': MachineEntry<'TEST'>;
    'src/__tests__/machine/asyncActions.5.machine': MachineEntry<'TEST'>;
    'src/__tests__/machine/asyncActions.6.machine': MachineEntry<'TEST'>;
    'src/__tests__/machine/asyncActions.7.machine': MachineEntry<'TEST'>;
    'src/__tests__/machine/asyncActions.8.machine': MachineEntry<'TEST'>;
    'src/__tests__/machine/asyncActions.9.machine': MachineEntry<'TEST'>;
    'src/__tests__/machine/asyncActions.10.machine': MachineEntry<'TEST'>;
    'src/__tests__/machine/cov.1.machine': MachineEntry<'NEXT'>;
    'src/__tests__/machine/cov.2.machine': MachineEntry<
      string,
      'machineNotDefined'
    >;
    'src/__tests__/machine/cov.3.machine': MachineEntry<
      string,
      'machineNotDefined'
    >;
    'src/__tests__/machine/longRuns.cov.1.machine': MachineEntry;
    'src/__tests__/machine/longRuns.cov.2.machine': MachineEntry;
    'src/__tests__/machine/longRuns.cov.3.machine': MachineEntry<'TEST'>;
    'src/__tests__/machine/longRuns.cov.4.machine': MachineEntry<'TEST'>;
    'src/__tests__/machine/longRuns.cov.5.machine': MachineEntry;
    'src/__tests__/machine/real.1.machine': MachineEntry<
      'NEXT' | 'PREVIOUS'
    >;
    'src/__tests__/machine/real.2.machine': MachineEntry<
      'NEXT' | 'PREVIOUS'
    >;
    'src/__tests__/machine/real.3.machine': MachineEntry<
      | 'CHANGE_LANG'
      | 'REMOVE'
      | 'ADD'
      | 'UPDATE'
      | 'UPDATE:NOW'
      | 'FIELDS:REGISTER'
      | 'FIELDS:MODIFY'
      | 'VALUES:REGISTER'
      | 'VALUES:MODIFY'
    >;
  }
}

export {};
