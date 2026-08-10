import { createMachine } from '@bemedev/app';
import { type, type inferO, type Keys } from '@bemedev/typings';
import {
  any,
  array,
  custom,
  litterals,
  optional,
  partial,
  record,
  union,
} from '@bemedev/typings/helpers';

const state = litterals('registration', 'registered', 'idle');
// type State = 'registration' | 'registered' | 'idle';

const csvData = record(union('string', 'number'));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deep = union('string', 'number', array(union('string', 'number')));

type CSVDataDeep = inferO<typeof deep> | CsvDataMap;
interface CsvDataMap {
  [key: Keys]: CSVDataDeep;
}
const csvDataDeep = custom<CSVDataDeep>();

const lang = litterals('en', 'es', 'fr');

const fieldType = litterals(
  'number',
  'date',
  'conditional',
  'text',
  'select',
  'checkbox',
  'color',
  'email',
  'time',
  'url',
  'tel',
  'datetime-local',
  'image',
  'file',
  'week',
);

const field = any({
  label: 'string',
  type: fieldType,
  options: optional(array('string')),
  data: optional(
    partial({
      data: [csvData],
      headers: ['string'],
      merged: csvDataDeep,
      name: 'string',
    }),
  ),
});

export default createMachine(
  'src/__tests__/machine/real.3.machine',
  {
    initial: 'idle',
    states: {
      idle: { entry: 'prepare', always: '/working' },
      working: {
        on: {
          CHANGE_LANG: { actions: ['changeLang'] },
          REMOVE: { actions: ['remove'] },
          ADD: { actions: ['add'] },
          UPDATE: { actions: 'update' },
          'UPDATE:NOW': { actions: 'update:now' },
          'FIELDS:REGISTER': {
            actions: ['fields.register', 'fields.register.finish'],
            target: '/working/register',
          },
          'FIELDS:MODIFY': {
            actions: ['fields.modify'],
            target: '/working/idle',
          },
        },

        initial: 'idle',

        states: {
          idle: {},

          register: {
            on: {
              'VALUES:REGISTER': {
                actions: [
                  'values.start.register',
                  'values.register',
                  'values.register.finish',
                ],
              },
              'VALUES:MODIFY': { actions: ['values.modify'] },
            },
          },
        },
      },
    },
  },
  {
    context: type(({ partial, array, soa, record }) =>
      partial({
        lang: lang,
        fields: array(field),
        responses: soa('string'),
        states: partial({ fields: state, values: state }),
        values: record('string'),
      }),
    ),

    eventsMap: type(({ partial, record }) => ({
      CHANGE_LANG: { lang: lang },
      REMOVE: { index: 'number' },
      ADD: 'never',
      UPDATE: { index: 'number', value: partial(field) },
      'UPDATE:NOW': { index: 'number', value: field },
      'FIELDS:REGISTER': 'never',
      'FIELDS:MODIFY': 'never',
      'VALUES:MODIFY': 'never',
      'VALUES:REGISTER': record('string'),
    })),
  },
);
