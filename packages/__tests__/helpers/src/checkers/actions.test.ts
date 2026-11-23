import { describe, expect, test } from 'vite-plus/test';
import { checkAction, checkActions } from '@bemedev/app-options/internal';

describe('checkAction', () => {
  test('#01 => string accepted', () => {
    expect(checkAction('action')).toBe(true);
  });

  test('#02 => describer accepted', () => {
    expect(checkAction({ name: 'action', description: 'An action' })).toBe(true);
  });

  test('#03 => number rejected', () => expect(checkAction(42)).toBe(false));

  test('#04 => empty object rejected', () => {
    expect(checkAction({})).toBe(false);
  });

  test('#05 => null rejected', () => expect(checkAction(null)).toBe(false));
});

describe('checkActions', () => {
  test('#01 => single string accepted', () => {
    expect(checkActions('action')).toBe(true);
  });

  test('#02 => array of strings accepted', () => {
    expect(checkActions(['first', 'second'])).toBe(true);
  });

  test('#03 => array of describers accepted', () => {
    const actions = [
      { name: 'first', description: 'First' },
      { name: 'second', description: 'Second' },
    ];
    expect(checkActions(actions)).toBe(true);
  });

  test('#04 => invalid entry rejected', () => {
    expect(checkActions(['action', 42])).toBe(false);
  });

  test('#05 => empty array accepted', () => {
    expect(checkActions([])).toBe(true);
  });

  test('#06 => undefined accepted', () => {
    expect(checkActions(undefined)).toBe(true);
  });

  test('#07 => empty string accepted', () => {
    expect(checkActions('')).toBe(true);
  });
});

describe('checkActions.orUndefined', () => {
  test('#01 => undefined accepted', () => {
    expect(checkActions.orUndefined(undefined)).toBe(true);
  });

  test('#02 => valid actions accepted', () => {
    expect(checkActions.orUndefined(['first', 'second'])).toBe(true);
  });

  test('#03 => invalid actions rejected', () => {
    expect(checkActions.orUndefined(['first', 42])).toBe(false);
  });
});
