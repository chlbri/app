import { constructTests } from '@bemedev/app-vitest';
import { interpret } from '@bemedev/app';
import machine from './tags.machine';

describe('Machine Tag Interpreter', () => {
  describe('#00 => Coverage', () => {
    test('#01 => tags', () => {
      const tags = machine.tags;
      const expected = ['idle', 'working', 'busy'];
      expect(tags).toEqual(expected);
    });

    test('#02 => context', () => {
      const context = machine.context;
      expect(context).toBeUndefined();
    });

    test('#03 => pContext', () => {
      const pContext = machine.pContext;
      expect(pContext).toBeUndefined();
    });

    test('#04 => __allPaths', () => {
      const allPaths = machine.__allPaths;
      expect(allPaths).toBeUndefined();
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
