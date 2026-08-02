import { cn } from '#/ui/cn';
import { useService } from '@bemedev/app-reactjs';
import { wrap } from '@bemedev/hook-wrapper';
import { useRouteContext } from '@tanstack/react-router';
import { Play, RotateCcw, Square } from 'lucide-react';
import { Button } from '../ui/components/button';

export const useComponents = () => {
  const service = useRouteContext({
    from: '/',
    select: s => s.counterService,
  });

  const hooks = useService(service);

  const FullStateWrapper = wrap.noParams(
    () => hooks.state({ selector: s => JSON.stringify(s, null, 2) }),

    value => (
      <pre className='p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-64 leading-relaxed'>
        {value}
      </pre>
    ),
  );

  const Status = wrap.noParams(
    () => hooks.state({ selector: s => s.status }),

    value => (
      <span className='font-semibold text-white capitalize'>{value}</span>
    ),
  );

  const Count = wrap.noParams(
    () => hooks.state({ selector: s => s.context.count }),
    value => value,
  );

  const StateValue = wrap(() =>
    hooks.state({ selector: s => JSON.stringify(s.value, null, 2) }),
  );

  const _isReady = () =>
    hooks.state({
      selector: s => s.status !== 'idle' && s.status !== 'stopped',
    });

  const StateIdle = wrap.noParams(
    () => {
      const isIdle = hooks.isInside('idle');
      const isReady = _isReady();
      return isReady && isIdle;
    },
    open => (
      <div
        className={cn(
          `p-4 rounded-xl border transition-all`,
          open
            ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md shadow-cyan-500/10'
            : 'bg-slate-900/40 border-slate-800 opacity-60',
        )}
      >
        <div className='text-xs text-slate-400 mb-1'>State 1</div>
        <div className='font-bold text-lg text-cyan-400'>idle</div>
        <div className='text-xs text-slate-500 mt-2'>Initial State</div>
      </div>
    ),
  );

  const StateActive = wrap.noParams(
    () => {
      const isActive = hooks.isInside('active');
      const isReady = _isReady();
      return isReady && isActive;
    },
    open => (
      <div
        className={cn(
          'p-4 rounded-xl border transition-all',
          open
            ? 'bg-teal-950/40 border-teal-500/50 shadow-md shadow-teal-500/10'
            : 'bg-slate-900/40 border-slate-800 opacity-60',
        )}
      >
        <div className='text-xs text-slate-400 mb-1'>State 2 (Nested)</div>
        <div className='font-bold text-lg text-teal-400'>active</div>
        <StateValue
          render={stateValue => (
            <div className='text-xs text-slate-400 mt-2 truncate'>
              {stateValue}
            </div>
          )}
        />
      </div>
    ),
  );

  const StateFinal = wrap.noParams(
    () => {
      const isFinal = hooks.state({ selector: s => s.value === 'final' });
      const isReady = _isReady();
      return isReady && isFinal;
    },
    open => (
      <div
        className={cn(
          `p-4 rounded-xl border transition-all`,
          open
            ? 'bg-rose-950/40 border-rose-500/50 shadow-md shadow-rose-500/10'
            : 'bg-slate-900/40 border-slate-800 opacity-60',
        )}
      >
        <div className='text-xs text-slate-400 mb-1'>State 3</div>
        <div className='font-bold text-lg text-rose-400'>final</div>
        <div className='text-xs text-slate-500 mt-2'>Terminal State</div>
      </div>
    ),
  );

  const StartStop = wrap.noParams(_isReady, isReady =>
    isReady ? (
      <Button
        variant='destructive'
        size='sm'
        onClick={service.stop}
        className='gap-1.5'
      >
        <Square className='w-4 h-4' /> Stop Service
      </Button>
    ) : (
      <Button
        variant='default'
        size='sm'
        onClick={service.start}
        className='gap-1.5'
      >
        <Play className='w-4 h-4' /> Start Service
      </Button>
    ),
  );

  const ActivateCounters = wrap.noParams(
    () => {
      const canStart = hooks.can('START');
      const isReady = _isReady();
      return !isReady || !canStart;
    },
    disabled => (
      <Button
        variant='default'
        onClick={sendEvent('START')}
        disabled={disabled}
        className='flex space-x-2 min-w-max'
      >
        <Play className='w-4 h-4' /> ACTIVATE COUNTERS
      </Button>
    ),
  );

  const CanStop = wrap(() => {
    const canStop = hooks.can('STOP');
    const isReady = _isReady();
    return !isReady || !canStop;
  });

  const Reset = wrap.noParams(
    () => {
      const isReady = _isReady();
      const canReset = hooks.can('RESET');
      return isReady && canReset;
    },
    canReset =>
      canReset && (
        <div className='mt-4 pt-4 border-t border-slate-800 flex justify-end'>
          <Button
            variant='outline'
            onClick={sendEvent('RESET')}
            className='gap-2 text-emerald-400 border-emerald-500/30'
          >
            <RotateCcw className='w-4 h-4' /> Reset Machine to Idle
          </Button>
        </div>
      ),
  );

  const sendEvent = (event: Parameters<typeof service.send>[0]) => {
    return () => service.send(event);
  };

  return {
    FullStateWrapper,
    Status,
    Count,
    StateValue,
    StateIdle,
    StateActive,
    StateFinal,
    StartStop,
    ActivateCounters,
    CanStop,
    Reset,
    sendEvent,
  };
};
