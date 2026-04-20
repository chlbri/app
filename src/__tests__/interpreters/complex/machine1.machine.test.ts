import { constructTests } from '#fixtures';
import { interpret } from '#interpreter';
import { decomposeSV } from '#utils';
import { BLOCK_IMMO_INTERMEDIARY, machine } from './machine1.machine';
import {
  ASSET_1,
  INTERMEDIARY_1,
  INTERMEDIARY_2,
} from './machine1.machine.fixtures';

vi.useFakeTimers();

describe('Complex machine 1', () => {
  const service = interpret(machine, {
    context: {},
  });

  const {
    start,
    wait500,
    wait150,
    send,
    useIntermediariesLength,
    stop,
    useStateValue,
  } = constructTests(service, ({ waiter, contexts }) => ({
    wait500: waiter(500),
    wait50: waiter(50),
    wait150: waiter(150),

    useIntermediariesLength: contexts(
      ({ context }) => context.intermediaries?.length,
    ),
  }));

  afterAll(() => {
    const [, fn] = stop();
    fn();
  });

  test(...useStateValue('idle'));
  test(...start());

  test(
    ...send({
      type: 'START',
      payload: {
        asset: ASSET_1,
      },
    }),
  );

  test(...useIntermediariesLength(1, 1));
  test(...useStateValue('idle'));
  test(...wait150());
  test(...useStateValue('checking'));

  describe('#03 => Check context', () => {
    test('#01 => the asset is defined', () => {
      expect(service.select('asset')).toEqual(ASSET_1);
    });

    describe('#02 => the intermediaries', () => {
      test(...useIntermediariesLength(1, 1));

      test('#02 => The Block_Immo intermediary is present', () => {
        expect(service.select('intermediaries.[0]')).toEqual(
          BLOCK_IMMO_INTERMEDIARY,
        );
      });
    });
  });

  test(...wait500(1, 4));

  test('#05 => state is at "working.idle"', () => {
    const decomposed = decomposeSV(service.state.value);
    expect(decomposed).toContain('working.idle');
    expect(decomposed).toContain('working');
    expect(decomposed).not.toContain('working.adding');
  });

  test(
    ...send({
      type: 'ADD_INTERMEDIARY',
      payload: INTERMEDIARY_1,
    }),
  );

  test('#07 => state is at "working.adding"', () => {
    const decomposed = decomposeSV(service.state.value);
    expect(decomposed).toContain('working.adding');
    expect(decomposed).toContain('working');
    expect(decomposed).not.toContain('working.idle');
  });

  test(...wait150(1, 8));

  test('#09 => state is at "working.idle"', () => {
    const decomposed = decomposeSV(service.state.value);
    expect(decomposed).toContain('working.idle');
    expect(decomposed).toContain('working');
    expect(decomposed).not.toContain('working.adding');
  });

  describe('#10 => Check context', () => {
    test('#01 => the asset is defined', () => {
      expect(service.select('asset')).toEqual(ASSET_1);
    });

    describe('#02 => the intermediaries', () => {
      test('#01 => should have length 3', () => {
        expect(service.select('intermediaries')).toHaveLength(2);
      });

      test('#02 => The Block_Immo intermediary is present', () => {
        expect(service.select('intermediaries.[0]')).toEqual(
          BLOCK_IMMO_INTERMEDIARY,
        );
      });

      test('#03 => The new intermediary is present', () => {
        expect(service.select('intermediaries.[1]')).toEqual(
          INTERMEDIARY_1,
        );
      });
    });
  });

  test(...send('RESET'));

  describe('#12 => Check context', () => {
    test('#01 => the asset is undefined', () => {
      expect(service.select('asset')).toBeUndefined();
    });

    test('#02 => the intermediaries are undefined', () => {
      expect(service.select('intermediaries')).toBeUndefined();
    });
  });

  test('#13 => state is at "idle"', () => {
    const decomposed = decomposeSV(service.state.value);
    expect(decomposed).toContain('idle');
    expect(decomposed).not.toContain('checking');
    expect(decomposed).not.toContain('working');
  });

  test(
    ...send({
      type: 'START',
      payload: {
        asset: ASSET_1,
        mandatory: INTERMEDIARY_2,
      },
    }),
  );

  describe('#15 => Check context', () => {
    test('#01 => the asset is defined', () => {
      expect(service.select('asset')).toEqual(ASSET_1);
    });

    describe('#02 => the intermediaries', () => {
      test('#01 => should have length 2', () => {
        expect(service.select('intermediaries')).toHaveLength(2);
      });

      test('#02 => The Block_Immo intermediary is present', () => {
        expect(service.select('intermediaries.[1]')).toEqual(
          BLOCK_IMMO_INTERMEDIARY,
        );
      });

      test('#03 => The mandatory intermediary is present', () => {
        expect(service.select('intermediaries.[0]')).toEqual(
          INTERMEDIARY_2,
        );
      });
    });
  });

  test(...wait500(1, 16));

  test('#17 => state is at "working.idle"', () => {
    const decomposed = decomposeSV(service.state.value);
    expect(decomposed).toContain('working.idle');
    expect(decomposed).toContain('working');
    expect(decomposed).not.toContain('working.adding');
  });

  test(
    ...send({
      type: 'ADD_INTERMEDIARY',
      payload: INTERMEDIARY_2,
    }),
  );

  test('#19 => state is at "working.idle"', () => {
    const decomposed = decomposeSV(service.state.value);
    expect(decomposed).toContain('working.idle');
    expect(decomposed).toContain('working');
    expect(decomposed).not.toContain('working.adding');
  });

  describe('#20 => Check context', () => {
    test('#01 => the asset is defined', () => {
      expect(service.select('asset')).toEqual(ASSET_1);
    });

    describe('#02 => the intermediaries', () => {
      test('#01 => should have length 2', () => {
        expect(service.select('intermediaries')).toHaveLength(2);
      });

      test('#02 => The Block_Immo intermediary is present', () => {
        expect(service.select('intermediaries.[1]')).toEqual(
          BLOCK_IMMO_INTERMEDIARY,
        );
      });

      test('#03 => The mandatory intermediary is present', () => {
        expect(service.select('intermediaries.[0]')).toEqual(
          INTERMEDIARY_2,
        );
      });
    });
  });

  test(
    ...send({
      type: 'ADD_INTERMEDIARY',
      payload: INTERMEDIARY_1,
    }),
  );

  test('#22 => state is at "working.adding"', () => {
    const decomposed = decomposeSV(service.state.value);
    expect(decomposed).toContain('working.adding');
    expect(decomposed).toContain('working');
    expect(decomposed).not.toContain('working.idle');
  });

  test(...wait150(1, 23));

  test('#24 => state is at "working.idle"', () => {
    const decomposed = decomposeSV(service.state.value);
    expect(decomposed).toContain('working.idle');
    expect(decomposed).toContain('working');
    expect(decomposed).not.toContain('working.adding');
  });

  describe('#25 => Check context', () => {
    test('#01 => the asset is defined', () => {
      expect(service.select('asset')).toEqual(ASSET_1);
    });

    describe('#02 => the intermediaries', () => {
      test('#01 => should have length 3', () => {
        expect(service.select('intermediaries')).toHaveLength(3);
      });

      test('#02 => The Block_Immo intermediary is present', () => {
        expect(service.select('intermediaries.[1]')).toEqual(
          BLOCK_IMMO_INTERMEDIARY,
        );
      });

      test('#03 => The mandatory intermediary is present', () => {
        expect(service.select('intermediaries.[0]')).toEqual(
          INTERMEDIARY_2,
        );
      });

      test('#04 => The new intermediary is present', () => {
        expect(service.select('intermediaries.[2]')).toEqual(
          INTERMEDIARY_1,
        );
      });
    });
  });
});
