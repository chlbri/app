import { config2, config21, config3 } from '#fixturesData';
import { flatMap } from '#states';
import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { buildPaths } from './parseTree.helpers';

describe('heleprs', () => {
  describe('#01 => buildPaths', () => {
    const { acceptation, success } = createTests(buildPaths, {});

    describe('#00 => Acceptation', acceptation);

    describe(
      '#01 => TESTS',
      success(
        {
          invite: 'config2',
          parameters: [flatMap.low(config2)],
          expected: {
            initial: 'idle',
            targets: [
              '/idle',
              '/working',
              '/working/fetch',
              '/working/fetch/idle',
              '/working/fetch/fetch',
              '/working/ui',
              '/working/ui/idle',
              '/working/ui/input',
              '/working/ui/final',
              '/final',
            ],

            states: {
              final: {
                targets: [
                  '/',
                  '/idle',
                  '/working',
                  '/working/fetch',
                  '/working/fetch/idle',
                  '/working/fetch/fetch',
                  '/working/ui',
                  '/working/ui/idle',
                  '/working/ui/input',
                  '/working/ui/final',
                ],
              },

              idle: {
                targets: [
                  '/',
                  '/working',
                  '/working/fetch',
                  '/working/fetch/idle',
                  '/working/fetch/fetch',
                  '/working/ui',
                  '/working/ui/idle',
                  '/working/ui/input',
                  '/working/ui/final',
                  '/final',
                ],
              },

              working: {
                targets: [
                  '/',
                  '/idle',
                  '/working/fetch',
                  '/working/fetch/idle',
                  '/working/fetch/fetch',
                  '/working/ui',
                  '/working/ui/idle',
                  '/working/ui/input',
                  '/working/ui/final',
                  '/final',
                ],

                states: {
                  fetch: {
                    initial: 'idle',

                    targets: [
                      '/',
                      '/idle',
                      '/working',
                      '/working/fetch/idle',
                      '/working/fetch/fetch',
                      '/working/ui',
                      '/working/ui/idle',
                      '/working/ui/input',
                      '/working/ui/final',
                      '/final',
                    ],

                    states: {
                      fetch: {
                        targets: [
                          '/',
                          '/idle',
                          '/working',
                          '/working/fetch',
                          '/working/fetch/idle',
                          '/working/ui',
                          '/working/ui/idle',
                          '/working/ui/input',
                          '/working/ui/final',
                          '/final',
                        ],
                      },

                      idle: {
                        targets: [
                          '/',
                          '/idle',
                          '/working',
                          '/working/fetch',
                          '/working/fetch/fetch',
                          '/working/ui',
                          '/working/ui/idle',
                          '/working/ui/input',
                          '/working/ui/final',
                          '/final',
                        ],
                      },
                    },
                  },

                  ui: {
                    initial: 'idle',

                    targets: [
                      '/',
                      '/idle',
                      '/working',
                      '/working/fetch',
                      '/working/fetch/idle',
                      '/working/fetch/fetch',
                      '/working/ui/idle',
                      '/working/ui/input',
                      '/working/ui/final',
                      '/final',
                    ],

                    states: {
                      final: {
                        targets: [
                          '/',
                          '/idle',
                          '/working',
                          '/working/fetch',
                          '/working/fetch/idle',
                          '/working/fetch/fetch',
                          '/working/ui',
                          '/working/ui/idle',
                          '/working/ui/input',
                          '/final',
                        ],
                      },

                      idle: {
                        targets: [
                          '/',
                          '/idle',
                          '/working',
                          '/working/fetch',
                          '/working/fetch/idle',
                          '/working/fetch/fetch',
                          '/working/ui',
                          '/working/ui/input',
                          '/working/ui/final',
                          '/final',
                        ],
                      },

                      input: {
                        targets: [
                          '/',
                          '/idle',
                          '/working',
                          '/working/fetch',
                          '/working/fetch/idle',
                          '/working/fetch/fetch',
                          '/working/ui',
                          '/working/ui/idle',
                          '/working/ui/final',
                          '/final',
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          invite: 'config21',
          parameters: [flatMap.low(config21)],
          expected: {
            initial: 'idle',
            targets: [
              '/idle',
              '/working',
              '/working/fetch',
              '/working/fetch/idle',
              '/working/fetch/fetch',
              '/working/ui',
              '/working/ui/idle',
              '/working/ui/input',
              '/working/ui/final',
              '/final',
            ],

            states: {
              final: {
                targets: [
                  '/',
                  '/idle',
                  '/working',
                  '/working/fetch',
                  '/working/fetch/idle',
                  '/working/fetch/fetch',
                  '/working/ui',
                  '/working/ui/idle',
                  '/working/ui/input',
                  '/working/ui/final',
                ],
              },

              idle: {
                targets: [
                  '/',
                  '/working',
                  '/working/fetch',
                  '/working/fetch/idle',
                  '/working/fetch/fetch',
                  '/working/ui',
                  '/working/ui/idle',
                  '/working/ui/input',
                  '/working/ui/final',
                  '/final',
                ],
              },

              working: {
                targets: [
                  '/',
                  '/idle',
                  '/working/fetch',
                  '/working/fetch/idle',
                  '/working/fetch/fetch',
                  '/working/ui',
                  '/working/ui/idle',
                  '/working/ui/input',
                  '/working/ui/final',
                  '/final',
                ],

                states: {
                  fetch: {
                    initial: 'idle',

                    targets: [
                      '/',
                      '/idle',
                      '/working',
                      '/working/fetch/idle',
                      '/working/fetch/fetch',
                      '/working/ui',
                      '/working/ui/idle',
                      '/working/ui/input',
                      '/working/ui/final',
                      '/final',
                    ],

                    states: {
                      fetch: {
                        targets: [
                          '/',
                          '/idle',
                          '/working',
                          '/working/fetch',
                          '/working/fetch/idle',
                          '/working/ui',
                          '/working/ui/idle',
                          '/working/ui/input',
                          '/working/ui/final',
                          '/final',
                        ],
                      },

                      idle: {
                        targets: [
                          '/',
                          '/idle',
                          '/working',
                          '/working/fetch',
                          '/working/fetch/fetch',
                          '/working/ui',
                          '/working/ui/idle',
                          '/working/ui/input',
                          '/working/ui/final',
                          '/final',
                        ],
                      },
                    },
                  },

                  ui: {
                    initial: 'idle',

                    targets: [
                      '/',
                      '/idle',
                      '/working',
                      '/working/fetch',
                      '/working/fetch/idle',
                      '/working/fetch/fetch',
                      '/working/ui/idle',
                      '/working/ui/input',
                      '/working/ui/final',
                      '/final',
                    ],

                    states: {
                      final: {
                        targets: [
                          '/',
                          '/idle',
                          '/working',
                          '/working/fetch',
                          '/working/fetch/idle',
                          '/working/fetch/fetch',
                          '/working/ui',
                          '/working/ui/idle',
                          '/working/ui/input',
                          '/final',
                        ],
                      },

                      idle: {
                        targets: [
                          '/',
                          '/idle',
                          '/working',
                          '/working/fetch',
                          '/working/fetch/idle',
                          '/working/fetch/fetch',
                          '/working/ui',
                          '/working/ui/input',
                          '/working/ui/final',
                          '/final',
                        ],
                      },

                      input: {
                        targets: [
                          '/',
                          '/idle',
                          '/working',
                          '/working/fetch',
                          '/working/fetch/idle',
                          '/working/fetch/fetch',
                          '/working/ui',
                          '/working/ui/idle',
                          '/working/ui/final',
                          '/final',
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          invite: 'config3',
          parameters: [flatMap.low(config3)],
          expected: {
            initial: 'state1',

            states: {
              state1: {
                initial: 'state11',
                states: {
                  state11: {
                    initial: 'state111',

                    targets: [
                      '/',
                      '/state1',
                      '/state1/state11/state111',
                      '/state1/state12',
                      '/state2',
                    ],

                    states: {
                      state111: {
                        targets: [
                          '/',
                          '/state1',
                          '/state1/state11',
                          '/state1/state12',
                          '/state2',
                        ],
                      },
                    },
                  },

                  state12: {
                    targets: [
                      '/',
                      '/state1',
                      '/state1/state11',
                      '/state1/state11/state111',
                      '/state2',
                    ],
                  },
                },
                targets: [
                  '/',
                  '/state1/state11',
                  '/state1/state11/state111',
                  '/state1/state12',
                  '/state2',
                ],
              },
              state2: {
                targets: [
                  '/',
                  '/state1',
                  '/state1/state11',
                  '/state1/state11/state111',
                  '/state1/state12',
                ],
              },
            },
            targets: [
              '/state1',
              '/state1/state11',
              '/state1/state11/state111',
              '/state1/state12',
              '/state2',
            ],
          },
        },
      ),
    );
  });
});
