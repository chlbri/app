import { createOptions } from '@bemedev/app-options';

import counter from './contracts/counter.contract';
import filters from './contracts/filters.contract';
import parallel from './contracts/parallel.contract';
import pipeline from './contracts/pipeline.contract';
import queue from './contracts/queue.contract';
import stairs from './contracts/stairs.contract';
import toggle from './contracts/toggle.contract';
import wizard from './contracts/wizard.contract';
import { interpretContract, machineWithOptions } from './fixtures';

describe('#01 => counter', () => {
  const options = createOptions(counter)(({ assign }) => ({
    actions: {
      increment: assign('count', ({ context }) => context.count + 1),
      reset: assign('count', () => 0),
    },
  }));

  const service = interpretContract(machineWithOptions(counter, options), {
    context: { count: 0 },
  });

  test('#01 => starts idle', () => {
    service.start();
    expect(service.state.value).toBe('idle');
  });

  test('#02 => START moves to active', () => {
    service.send('START');
    expect(service.state.value).toBe('active');
  });

  test('#03 => INC increments twice', () => {
    service.send('INC');
    service.send('INC');
    expect(service.select('count')).toBe(2);
  });

  test('#04 => RESET clears the count', () => {
    service.send('RESET');
    expect(service.select('count')).toBe(0);
  });

  test('#05 => STOP moves back to idle', () => {
    service.send('STOP');
    expect(service.state.value).toBe('idle');
  });
});

describe('#02 => toggle', () => {
  const options = createOptions(toggle)(({ assign, isValue, isNotValue }) => ({
    actions: {
      enable: assign(['enabled', 'changes'], ({ context }) => [
        true,
        context.changes + 1,
      ]),
      disable: assign(['enabled', 'changes'], ({ context }) => [
        false,
        context.changes + 1,
      ]),
    },
    guards: {
      isOff: isNotValue('context.enabled', true),
      isOn: isValue('context.enabled', true),
    },
  }));

  const service = interpretContract(machineWithOptions(toggle, options), {
    context: { enabled: false, changes: 0 },
  });

  test('#01 => starts off', () => {
    service.start();
    expect(service.state.value).toBe('off');
  });

  test('#02 => toggles on', () => {
    service.send('TOGGLE');
    expect(service.state.value).toBe('on');
    expect(service.select('enabled')).toBe(true);
  });

  test('#03 => toggles off', () => {
    service.send('TOGGLE');
    expect(service.state.value).toBe('off');
    expect(service.select('enabled')).toBe(false);
  });

  test('#04 => counts both changes', () => {
    expect(service.select('changes')).toBe(2);
  });
});

describe('#03 => stairs', () => {
  const options = createOptions(stairs)(() => ({}));
  const service = interpretContract(machineWithOptions(stairs, options));

  test('#01 => starts on the ground', () => {
    service.start();
    expect(service.state.value).toBe('ground');
  });

  test('#02 => UP enters the compound initial state', () => {
    service.send('UP');
    expect(service.state.value).toEqual({ first: 'landing' });
  });

  test('#03 => UP from the landing reaches the second floor', () => {
    service.send('UP');
    expect(service.state.value).toBe('second');
  });

  test('#04 => DOWN returns to the compound initial state', () => {
    service.send('DOWN');
    expect(service.state.value).toEqual({ first: 'landing' });
  });

  test('#05 => DOWN exits the compound state', () => {
    service.send('DOWN');
    expect(service.state.value).toBe('ground');
  });
});

describe('#04 => wizard', () => {
  const options = createOptions(wizard)(({ assign, guardBatch, isNotValue }) => ({
    actions: {
      setName: assign('name', { SET_NAME: ({ payload }) => payload.name }),
      setAddress: assign('address', {
        SET_ADDRESS: ({ payload }) => payload.address,
      }),
    },
    guards: {
      canGo: isNotValue('context.name', ''),
      canReview: guardBatch(
        isNotValue('context.name', ''),
        isNotValue('context.address', ''),
      ),
    },
  }));

  const service = interpretContract(machineWithOptions(wizard, options), {
    context: { name: '', address: '' },
  });

  test('#01 => blocked without a name', () => {
    service.start();
    service.send('NEXT');
    expect(service.state.value).toBe('personal');
  });

  test('#02 => SET_NAME unblocks the guard', () => {
    service.send({ type: 'SET_NAME', payload: { name: 'bri' } });
    expect(service.select('name')).toBe('bri');
  });

  test('#03 => NEXT reaches the address step', () => {
    service.send('NEXT');
    expect(service.state.value).toBe('address');
  });

  test('#04 => guardBatch blocks without an address', () => {
    service.send('NEXT');
    expect(service.state.value).toBe('address');
  });

  test('#05 => SET_ADDRESS and NEXT reach the review step', () => {
    service.send({ type: 'SET_ADDRESS', payload: { address: 'paris' } });
    service.send('NEXT');
    expect(service.state.value).toBe('review');
  });

  test('#06 => SUBMIT completes the wizard', () => {
    service.send('SUBMIT');
    expect(service.state.value).toBe('done');
  });

  test('#07 => BACK is ignored once done', () => {
    service.send('BACK');
    expect(service.state.value).toBe('done');
  });
});

describe('#05 => queue', () => {
  const options = createOptions(queue)(({ assign, batch, _for }) => ({
    actions: {
      push: assign('pending', ({ context }) => context.pending + 1),
      flush: batch(
        _for(
          3,
          assign('processed', ({ context }) => context.processed + 1),
        ),
        assign('pending', () => 0),
      ),
    },
  }));

  const service = interpretContract(machineWithOptions(queue, options), {
    context: { pending: 0, processed: 0 },
  });

  test('#01 => starts idle', () => {
    service.start();
    expect(service.state.value).toBe('idle');
  });

  test('#02 => PUSH stacks pending items', () => {
    service.send('PUSH');
    service.send('PUSH');
    expect(service.select('pending')).toBe(2);
  });

  test('#03 => FLUSH processes items with _for', () => {
    service.send('FLUSH');
    expect(service.select('processed')).toBe(3);
    expect(service.select('pending')).toBe(0);
  });

  test('#04 => FLUSH moves to busy', () => {
    expect(service.state.value).toBe('busy');
  });

  test('#05 => DONE returns to idle', () => {
    service.send('DONE');
    expect(service.state.value).toBe('idle');
  });
});

describe('#06 => pipeline', () => {
  const options = createOptions(pipeline)(({ assign }) => ({
    actions: {
      prepare: assign('steps', ({ context }) => context.steps + 1),
      complete: assign('steps', ({ context }) => context.steps + 1),
    },
  }));

  const service = interpretContract(machineWithOptions(pipeline, options), {
    context: { steps: 0 },
  });

  test('#01 => always transition skips the start state', () => {
    service.start();
    expect(service.state.value).toBe('processing');
  });

  test('#02 => entry action ran', () => {
    expect(service.select('steps')).toBe(1);
  });

  test('#03 => FINISH completes the pipeline', () => {
    service.send('FINISH');
    expect(service.state.value).toBe('completed');
    expect(service.select('steps')).toBe(2);
  });
});

describe('#07 => filters', () => {
  const options = createOptions(filters)(({ erase, filter }) => ({
    actions: {
      filterScores: filter('scores', (score: number) => score > 5),
      eraseScores: erase('scores'),
    },
  }));

  const service = interpretContract(machineWithOptions(filters, options), {
    context: { scores: [1, 7, 3, 9] },
  });

  test('#01 => starts idle', () => {
    service.start();
    expect(service.state.value).toBe('idle');
  });

  test('#02 => filter keeps matching items', () => {
    service.send('FILTER');
    expect(service.select('scores')).toEqual([7, 9]);
  });

  test('#03 => erase removes the property', () => {
    service.send('ERASE');
    expect(service.select('scores')).toBeUndefined();
  });
});

describe('#08 => parallel', () => {
  const options = createOptions(parallel)(() => ({}));
  const service = interpretContract(machineWithOptions(parallel, options));

  test('#01 => both regions start', () => {
    service.start();
    expect(service.state.value).toEqual({ left: 'off', right: 'idle' });
  });

  test('#02 => TOGGLE only affects the left region', () => {
    service.send('TOGGLE');
    expect(service.state.value).toEqual({ left: 'on', right: 'idle' });
  });

  test('#03 => ADVANCE only affects the right region', () => {
    service.send('ADVANCE');
    expect(service.state.value).toEqual({ left: 'on', right: 'advanced' });
  });
});
