import type { Service } from '#/machines/counter';
import { TEST_LOGS } from '#/machines/counter.fixtures';
import { cn } from '#/ui/cn';
import { useService } from '@bemedev/app-reactjs';
import { wrap } from '@bemedev/hook-wrapper';
import {
  ChevronDown,
  Code2,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Square,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '../ui/components/button';
import { Expand } from '../ui/components/Expand';

export const useComponents = (service: Service) => {
  const hooks = useService(service);

  const FullStateWrapper: React.FC<{
    defaultOpen?: boolean;
    className?: string;
  }> = ({ defaultOpen = false, className }) => {
    const getJSon = () => JSON.stringify(service.state, null, 2);

    const [json, _setJson] = useState(getJSon);
    const setJson = () => _setJson(getJSon);

    return (
      <Expand
        id='full-state-json'
        defaultOpen={defaultOpen}
        className={cn(
          'border-slate-800 bg-slate-900/60 shadow-lg',
          className,
        )}
        title={({ isOpen }) => (
          <div className='w-full px-4 py-3 bg-slate-900 hover:bg-slate-800/80 text-slate-300 font-medium text-sm flex items-center justify-between transition-colors cursor-pointer'>
            <div className='flex items-center space-x-2.5'>
              <Code2 className='size-4 text-yellow-700' />
              <h2 className='font-semibold text-slate-200'>
                Full State JSON
              </h2>
            </div>

            <div className='flex items-center space-x-2'>
              <span className='text-xs text-slate-400 font-medium'>
                {isOpen ? 'Hide State' : 'Show State'}
              </span>

              <ChevronDown
                className={cn(
                  'size-4 text-slate-400 transition-transform duration-300',
                  { 'rotate-180': isOpen },
                )}
              />
            </div>
          </div>
        )}

        content={
          <div className='p-4 border-t border-slate-800 bg-slate-950 relative group'>
            <button
              type='button'
              onClick={e => {
                e.stopPropagation();
                setJson();
              }}
              className='absolute top-3 right-3 px-2.5 py-1 text-xs font-sans rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer z-10'
              title='Fetch current machine state'
            >
              <RefreshCw className='w-3.5 h-3.5 text-yellow-700' />
              <span>Refresh</span>
            </button>
            <pre className='font-mono text-xs text-yellow-200/90 overflow-x-auto max-h-64 p-2 leading-relaxed selection:bg-yellow-200/30'>
              {json}
            </pre>
          </div>
        }
      />
    );
  };

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

  const Speed = wrap.noParams(
    () => hooks.state({ selector: s => s.context.speed }),
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
        <Square className='size-4' /> Stop
      </Button>
    ) : (
      <Button
        variant='default'
        size='sm'
        onClick={service.start}
        className='gap-1.5'
      >
        <Play className='size-4' /> Start
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
        <Play className='size-4' /> ACTIVATE COUNTERS
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
            <RotateCcw className='size-4' /> Reset Machine to Idle
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
    Speed,
    StateValue,
    StateIdle,
    StateActive,
    StateFinal,
    StartStop,
    ActivateCounters,
    CanStop,
    Reset,
    sendEvent,
    service,
  };
};

useComponents.test = (service: Service) => {
  const all = useComponents(service);
  const tests = TEST_LOGS(service, 350);

  const StartStopTests = wrap.noParams(
    () => {
      const [state, setState] = useState(tests.state);
      useEffect(() => tests.pause as any, []);
      tests.subscribe(setState);
      const isRunning = state === 'active';

      const onClick = useCallback(() => {
        if (isRunning) tests.pause();
        else tests.resume();
      }, [isRunning]);

      return { isRunning, onClick };
    },
    ({ isRunning, onClick }) => {
      return (
        <button
          type='button'
          onClick={onClick}
          className={cn(
            'group relative inline-flex items-center justify-center overflow-hidden rounded-xl p-0.5 font-medium text-white shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer',
            isRunning
              ? 'bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-emerald-500/25 hover:shadow-emerald-500/40'
              : 'bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-600 shadow-indigo-500/25 hover:shadow-indigo-500/40',
          )}
        >
          <span className='absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100' />
          <div className='relative flex items-center gap-2.5 rounded-[10px] bg-slate-950/60 px-3.5 py-1.5 backdrop-blur-md transition-colors group-hover:bg-transparent'>
            {isRunning ? (
              <>
                <div className='relative flex h-2.5 w-2.5 items-center justify-center'>
                  <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
                  <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-400' />
                </div>
                <Pause className='h-3.5 w-3.5 fill-emerald-300 text-emerald-300 transition-transform group-hover:scale-110' />
                <div className='flex flex-col text-left'>
                  <span className='text-[9px] font-bold tracking-wider text-emerald-300 uppercase leading-none'>
                    Tests Running
                  </span>
                  <span className='text-xs font-extrabold text-white leading-tight'>
                    Pause Tests
                  </span>
                </div>
              </>
            ) : (
              <>
                <Play className='h-3.5 w-3.5 text-cyan-300 animate-pulse' />
                <div className='flex flex-col text-left'>
                  <span className='text-[9px] font-bold tracking-wider text-cyan-300 uppercase leading-none'>
                    Tests Stopped
                  </span>
                  <span className='text-xs font-extrabold text-white leading-tight'>
                    Start Tests
                  </span>
                </div>
              </>
            )}
          </div>
        </button>
      );
    },
  );

  const FullStateWrapper: React.FC<{
    defaultOpen?: boolean;
    className?: string;
  }> = ({ defaultOpen = false, className }) => {
    const json = useService(service).state({
      selector: s => JSON.stringify(s, null, 2),
    });

    return (
      <Expand
        id='full-state-json'
        defaultOpen={defaultOpen}
        className={cn(
          'border-slate-800 bg-slate-900/60 shadow-lg',
          className,
        )}
        title={({ isOpen }) => (
          <div className='w-full px-4 py-3 bg-slate-900 hover:bg-slate-800/80 text-slate-300 font-medium text-sm flex items-center justify-between transition-colors cursor-pointer'>
            <div className='flex items-center space-x-2.5'>
              <Code2 className='size-4 text-yellow-700' />
              <h2 className='font-semibold text-slate-200'>
                Full State JSON
              </h2>
            </div>

            <div className='flex items-center space-x-2'>
              <span className='text-xs text-slate-400 font-medium'>
                {isOpen ? 'Hide State' : 'Show State'}
              </span>

              <ChevronDown
                className={cn(
                  'size-4 text-slate-400 transition-transform duration-300',
                  { 'rotate-180': isOpen },
                )}
              />
            </div>
          </div>
        )}

        content={
          <div className='p-4 border-t border-slate-800 bg-slate-950 relative group'>
            <pre className='font-mono text-xs text-yellow-200/90 overflow-x-auto max-h-64 p-2 leading-relaxed selection:bg-yellow-200/30'>
              {json}
            </pre>
          </div>
        }
      />
    );
  };

  useEffect(() => {
    if (service.status === 'paused') service.resume();
    service.start();
  }, []);

  return { ...all, FullStateWrapper, StartStopTests };
};
