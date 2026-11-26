import {
  isAfter,
  isOn,
  isSingleOrArrayT,
  isTransitionArray,
  isTransitionConfig,
  isTransitionConfigMap,
} from '@bemedev/app-options/internal';
import { describe, expect, test } from 'vite-plus/test';

describe('isTransitionConfigMap', () => {
  describe('#01 => rejected values', () => {
    test('#01 => undefined rejected', () => {
      expect(isTransitionConfigMap(undefined)).toBe(false);
    });

    test('#02 => null rejected', () => {
      expect(isTransitionConfigMap(null)).toBe(false);
    });

    test('#03 => empty string rejected', () => {
      expect(isTransitionConfigMap('')).toBe(false);
    });

    test('#04 => zero rejected', () => {
      expect(isTransitionConfigMap(0)).toBe(false);
    });

    test('#05 => number rejected', () => {
      expect(isTransitionConfigMap(42)).toBe(false);
    });

    test('#06 => non-empty string rejected', () => {
      expect(isTransitionConfigMap('value')).toBe(false);
    });

    test('#07 => empty object rejected', () => {
      expect(isTransitionConfigMap({})).toBe(false);
    });

    test('#08 => extra key rejected', () => {
      const value = { target: 'idle', extra: true };
      expect(isTransitionConfigMap(value, 'idle')).toBe(false);
    });

    test('#09 => missing target and actions rejected', () => {
      expect(isTransitionConfigMap({ guards: 'guard' })).toBe(false);
    });

    test('#10 => description key rejected', () => {
      const value = { target: 'idle', description: 42 };
      expect(isTransitionConfigMap(value, 'idle')).toBe(false);
    });

    test('#11 => non-string target rejected', () => {
      expect(isTransitionConfigMap({ target: 42 })).toBe(false);
    });

    test('#12 => unknown target rejected', () => {
      expect(isTransitionConfigMap({ target: 'other' }, 'idle')).toBe(false);
    });

    test('#13 => invalid actions rejected', () => {
      expect(isTransitionConfigMap({ actions: 42 })).toBe(false);
    });

    test('#14 => invalid guards rejected', () => {
      const value = { target: 'idle', guards: 42 };
      expect(isTransitionConfigMap(value, 'idle')).toBe(false);
    });
  });

  describe('#02 => accepted values', () => {
    test('#01 => target accepted', () => {
      expect(isTransitionConfigMap({ target: 'idle' }, 'idle')).toBe(true);
    });

    test('#02 => actions only accepted', () => {
      expect(isTransitionConfigMap({ actions: 'act' })).toBe(true);
    });

    test('#03 => undefined target accepted', () => {
      const value = { target: undefined, actions: 'act' };
      expect(isTransitionConfigMap(value)).toBe(true);
    });

    test('#04 => complete configuration accepted', () => {
      const value = { target: 'idle', actions: ['act'], guards: 'guard' };
      expect(isTransitionConfigMap(value, 'idle')).toBe(true);
    });
  });
});

describe('isTransitionConfig', () => {
  test('#01 => known string target accepted', () => {
    expect(isTransitionConfig('idle', 'idle')).toBe(true);
  });

  test('#02 => unknown string target rejected', () => {
    expect(isTransitionConfig('other', 'idle')).toBe(false);
  });

  test('#03 => string target without keys accepted', () => {
    expect(isTransitionConfig('anywhere')).toBe(true);
  });

  test('#04 => configuration map accepted', () => {
    expect(isTransitionConfig({ target: 'idle' }, 'idle')).toBe(true);
  });

  test('#05 => empty object rejected', () => {
    expect(isTransitionConfig({})).toBe(false);
  });

  test('#06 => number rejected', () => {
    expect(isTransitionConfig(42)).toBe(false);
  });

  test('#07 => undefined rejected', () => {
    expect(isTransitionConfig(undefined)).toBe(false);
  });
});

describe('isTransitionArray', () => {
  test('#01 => string rejected', () => {
    expect(isTransitionArray('idle', 'idle')).toBe(false);
  });

  test('#02 => object rejected', () => {
    expect(isTransitionArray({ target: 'idle' }, 'idle')).toBe(false);
  });

  test('#03 => empty array rejected', () => {
    expect(isTransitionArray([])).toBe(false);
  });

  test('#04 => null entry rejected', () => {
    expect(isTransitionArray([null])).toBe(false);
  });

  test('#05 => number entry rejected', () => {
    expect(isTransitionArray([42])).toBe(false);
  });

  test('#06 => invalid head rejected', () => {
    expect(isTransitionArray([{}, 'idle'], 'idle')).toBe(false);
  });

  test('#07 => head without guards rejected', () => {
    expect(isTransitionArray([{ target: 'idle' }, 'idle'], 'idle')).toBe(false);
  });

  test('#08 => single string entry accepted', () => {
    expect(isTransitionArray(['idle'], 'idle')).toBe(true);
  });

  test('#09 => guarded head accepted', () => {
    const value = [{ target: 'idle', guards: 'guard' }, 'idle'];
    expect(isTransitionArray(value, 'idle')).toBe(true);
  });

  test('#10 => multiple guarded heads accepted', () => {
    const value = [
      { target: 'idle', guards: 'guard' },
      { target: 'other', guards: 'guard' },
      'idle',
    ];
    expect(isTransitionArray(value, 'idle', 'other')).toBe(true);
  });

  test('#11 => unknown last target rejected', () => {
    expect(isTransitionArray(['other'], 'idle')).toBe(false);
  });
});

describe('isSingleOrArrayT', () => {
  test('#01 => single string accepted', () => {
    expect(isSingleOrArrayT('idle', 'idle')).toBe(true);
  });

  test('#02 => single configuration accepted', () => {
    expect(isSingleOrArrayT({ target: 'idle' }, 'idle')).toBe(true);
  });

  test('#03 => transition array accepted', () => {
    const value = [{ target: 'idle', guards: 'guard' }, 'idle'];
    expect(isSingleOrArrayT(value, 'idle')).toBe(true);
  });

  test('#04 => number rejected', () => {
    expect(isSingleOrArrayT(42)).toBe(false);
  });

  test('#05 => undefined rejected', () => {
    expect(isSingleOrArrayT(undefined)).toBe(false);
  });
});

describe('isSingleOrArrayT.orUndefined', () => {
  test('#01 => undefined accepted', () => {
    expect(isSingleOrArrayT.orUndefined(undefined)).toBe(true);
  });

  test('#02 => valid transition accepted', () => {
    expect(isSingleOrArrayT.orUndefined('idle', 'idle')).toBe(true);
  });

  test('#03 => invalid transition rejected', () => {
    expect(isSingleOrArrayT.orUndefined(42)).toBe(false);
  });
});

describe('isAfter', () => {
  test('#01 => number rejected', () => expect(isAfter(42)).toBe(false));

  test('#02 => string rejected', () => {
    expect(isAfter('value')).toBe(false);
  });

  test('#03 => null rejected', () => expect(isAfter(null)).toBe(false));
  test('#04 => array rejected', () => expect(isAfter([])).toBe(false));
  test('#05 => empty map accepted', () => expect(isAfter({})).toBe(true));

  test('#06 => known target accepted', () => {
    expect(isAfter({ EVENT: 'idle' }, 'idle')).toBe(true);
  });

  test('#07 => unknown target rejected', () => {
    expect(isAfter({ EVENT: 'other' }, 'idle')).toBe(false);
  });

  test('#08 => invalid value rejected', () => {
    expect(isAfter({ EVENT: 42 })).toBe(false);
  });

  test('#09 => configuration value accepted', () => {
    expect(isAfter({ EVENT: { target: 'idle' } }, 'idle')).toBe(true);
  });

  test('#10 => transition array accepted', () => {
    const value = { EVENT: [{ target: 'idle', guards: 'guard' }, 'idle'] };
    expect(isAfter(value, 'idle')).toBe(true);
  });
});

describe('isAfter.orUndefined', () => {
  test('#01 => undefined accepted', () => {
    expect(isAfter.orUndefined(undefined)).toBe(true);
  });

  test('#02 => valid map accepted', () => {
    expect(isAfter.orUndefined({ EVENT: 'idle' }, 'idle')).toBe(true);
  });

  test('#03 => invalid map rejected', () => {
    expect(isAfter.orUndefined(42)).toBe(false);
  });
});

describe('isOn', () => {
  test('#01 => empty map accepted', () => expect(isOn({})).toBe(true));

  test('#02 => known target accepted', () => {
    expect(isOn({ EVENT: 'idle' }, 'idle')).toBe(true);
  });

  test('#03 => number rejected', () => expect(isOn(42)).toBe(false));
});
