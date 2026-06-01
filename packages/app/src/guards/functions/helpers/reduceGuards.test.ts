import { reduceGuards } from './reduceGuards';
import type { WithDescriber } from '#actions';

describe('reduceGuard', () => {
  test('single string action', () => {
    expect(reduceGuards('action1')).toStrictEqual(['action1']);
  });

  test('single describer action', () => {
    const action: WithDescriber = {
      name: 'myAction',
      description: 'This is a describer action',
    };
    expect(reduceGuards(action)).toStrictEqual([action]);
  });

  test('multiple string actions', () => {
    expect(reduceGuards('action1', 'action2', 'action3')).toStrictEqual([
      'action1',
      'action2',
      'action3',
    ]);
  });

  test('and with multiple actions', () => {
    expect(
      reduceGuards({ and: ['action1', 'action2', 'action3'] }),
    ).toStrictEqual(['action1', 'action2', 'action3']);
  });

  test('or with multiple actions', () => {
    expect(
      reduceGuards({ or: ['action1', 'action2', 'action3'] }),
    ).toStrictEqual(['action1', 'action2', 'action3']);
  });

  test('nested and inside or', () => {
    expect(
      reduceGuards({
        or: [{ and: ['action1', 'action2'] }, 'action3'],
      }),
    ).toStrictEqual(['action1', 'action2', 'action3']);
  });

  test('nested or inside and', () => {
    expect(
      reduceGuards({
        and: [{ or: ['action1', 'action2'] }, 'action3'],
      }),
    ).toStrictEqual(['action1', 'action2', 'action3']);
  });

  test('deeply nested structures', () => {
    expect(
      reduceGuards({
        and: [
          {
            or: [{ and: ['action1', 'action2'] }, 'action3'],
          },
          'action4',
        ],
      }),
    ).toStrictEqual(['action1', 'action2', 'action3', 'action4']);
  });

  test('mixed string and describer actions', () => {
    const desc1: WithDescriber = {
      name: 'desc1',
      description: 'This is desc1',
    };
    const desc2: WithDescriber = {
      name: 'desc2',
      description: 'This is desc2',
    };

    expect(
      reduceGuards({ and: ['action1', desc1, 'action2', desc2] }),
    ).toStrictEqual(['action1', desc1, 'action2', desc2]);
  });

  test('multiple parameters with guards', () => {
    expect(
      reduceGuards(
        'action1',
        { and: ['action2', 'action3'] },
        { or: ['action4', 'action5'] },
      ),
    ).toStrictEqual([
      'action1',
      'action2',
      'action3',
      'action4',
      'action5',
    ]);
  });

  test('empty and array', () => {
    expect(reduceGuards({ and: [] })).toStrictEqual([]);
  });

  test('empty or array', () => {
    expect(reduceGuards({ or: [] })).toStrictEqual([]);
  });

  test('complex nested with empty arrays', () => {
    expect(
      reduceGuards({
        and: ['action1', { or: [] }, 'action2', { and: ['action3'] }],
      }),
    ).toStrictEqual(['action1', 'action2', 'action3']);
  });
  test('More complex nested with empty arrays', () => {
    const action1: WithDescriber = {
      name: 'action1',
      description: 'This is action1',
    };
    const action3Describer: WithDescriber = {
      name: 'action3',
      description: 'This is action3',
    };
    const action4Describer: WithDescriber = {
      name: 'action4',
      description: 'This is action4',
    };

    expect(
      reduceGuards({
        and: [
          action1,
          {
            or: [action3Describer],
          },
          'action2',
          'action4',
          {
            and: ['action3', action4Describer],
          },
        ],
      }),
    ).toStrictEqual([
      action1,
      action3Describer,
      'action2',
      action4Describer,
    ]);
  });

  test('duplicate string actions are skipped', () => {
    expect(
      reduceGuards({
        and: ['action1', 'action2', 'action1', 'action3', 'action2'],
      }),
    ).toStrictEqual(['action1', 'action2', 'action3']);
  });

  test('string replaced by describer', () => {
    const actionDescriber: WithDescriber = {
      name: 'action1',
      description: 'This is action1',
    };

    expect(
      reduceGuards('action1', 'action2', actionDescriber),
    ).toStrictEqual([actionDescriber, 'action2']);
  });

  test('duplicate describers by key are skipped', () => {
    const action1a: WithDescriber = {
      name: 'action1',
      description: 'First action1',
    };
    const action1b: WithDescriber = {
      name: 'action1',
      description: 'Second action1',
    };

    expect(reduceGuards('action1', action1a, action1b)).toStrictEqual([
      action1a,
    ]);
  });
});
