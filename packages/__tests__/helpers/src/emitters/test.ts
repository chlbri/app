import { createPausable } from '@bemedev/rx-pausable';
import { Subject } from 'rxjs';
import { createSequence } from '@bemedev/sequence';

const sub = new Subject<number>();
const DELAY = 350;
const pausable = createPausable(sub, {
  next: value => {
    console.warn('Next received in subject subscription:', value);
  },
  error: value => {
    console.warn('Error received in subject subscription:', value);
  },
  complete: () => console.warn('Subject completed'),
});

createSequence()
  .add(0, pausable.start)
  .add(DELAY, () => sub.next(1))
  .add(DELAY, () => sub.next(2))
  .add(DELAY, () => sub.error('Test error'))
  .add(DELAY, () => sub.next(3))
  .add(DELAY, () => sub.complete())
  .run();
