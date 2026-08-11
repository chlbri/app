import { constructTests } from '@bemedev/app-vitest';
import { interpret } from '@bemedev/app';
import machine from './tags.machine';

describe('Machine Tag Interpreter', () => {
  describe('#00 => Coverage', () => {
    test('#01 => tags', () => {
      expect(machine.tags).toEqual(['idle', 'working', 'busy']);
    });

    test('#02 => context', () => expect(machine.context).toBeUndefined());
    test('#03 => pContext', () =>
      expect(machine.pContext).toBeUndefined());

    test('#04 => __allPaths', () => {
      expect(machine.__allPaths).toBeUndefined();
    });
  });

  describe('#01 => execution', () => {
    const service = interpret(machine);

    const { start, useStateValue, useNext, usePrev, useTags } =
      constructTests(service, ({ sender }) => ({
        useNext: sender('NEXT'),
        usePrev: sender('PREV'),
      }));

    it(...start());
    it(...useStateValue('idle'));
    it(...useTags('idle'));
    it(...useNext());
    it(...useStateValue('working'));
    it(...useTags('working', 'busy'));
    it(...usePrev());
    it(...useStateValue('idle'));
    it(...useTags('idle'));
    it(...useNext());
    it(...useStateValue('working'));
    it(...useTags('working', 'busy'));
    it(...useNext());
    it(...useStateValue('final'));
    it(...useTags());
  });
});
