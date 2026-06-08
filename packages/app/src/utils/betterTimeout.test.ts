import { betterTimeout } from './betterTimeout';

describe('betterTimeout tests', () => {
  beforeAll(() => vi.useFakeTimers());

  test('#01 => resolves when delay is within maxTime', () => {
    const callback = vi.fn();
    const onError = vi.fn();
    betterTimeout({ callback, onError, ms: 100, maxTime: 500 });
    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  test('#02 => rejects with MAX_EXCEEDED when delay exceeds maxTime', () => {
    const callback = vi.fn();
    const onError = vi.fn();
    betterTimeout({ callback, onError, ms: 1000, maxTime: 500 });
    vi.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalled();
    const err = onError.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('MAX_EXCEEDED');
  });

  test('#03 => uses default MAX_TIME when maxTime is not provided', () => {
    const callback = vi.fn();
    const onError = vi.fn();
    betterTimeout({ callback, onError, ms: 700_000 });
    vi.advanceTimersByTime(600_000);
    expect(callback).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalled();
    const err = onError.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('MAX_EXCEEDED');
  });

  test('#04 => resolves with default MAX_TIME if delay is less than default MAX_TIME', () => {
    const callback = vi.fn();
    const onError = vi.fn();
    betterTimeout({ callback, onError, ms: 300_000 });
    vi.advanceTimersByTime(300_000);
    expect(callback).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
});
