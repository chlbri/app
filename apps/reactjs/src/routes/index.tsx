import { cn } from '#/ui/cn';
import { useService } from '@bemedev/app-reactjs';
import { createFileRoute } from '@tanstack/react-router';
import {
  Activity,
  Code2,
  Cpu,
  Flame,
  Gauge,
  History,
  Layers,
  Minus,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Square,
  Zap,
} from 'lucide-react';
import { Badge } from '../ui/components/badge';
import { Button } from '../ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/components/card';
import { MachineConfig } from '#/ui/components/MachineConfig';
import { counterMachine } from '#/machines/counter';

export const Route = createFileRoute('/')({
  component: () => {
    // Create an interpreter service instance once
    const service = Route.useRouteContext({
      select: s => s.counterService,
    });

    // 2. Reactively consume state machine using @bemedev/app-reactjs useService hook
    const hooks = useService(service);

    // A. Full State Subscription
    const fullState = hooks.state();

    // State log history
    const logs = hooks.state({ selector: s => s.context.logs });

    // B. Selected context count subscription
    const count = hooks.state({
      selector: s => s.context.count,
      equals: (a, b) => a === b,
    });

    // C. Selected state value subscription
    const stateValue = hooks.state({ selector: s => s.value });

    // D. Selected tags subscription
    const tags = hooks.state({ selector: s => s.tags });
    const isReady = hooks.state({
      selector: s => s.status !== 'idle' && s.status !== 'stopped',
    });

    const _canStart = hooks.can('START');
    const canStart = isReady && _canStart;
    const _canReset = hooks.can('RESET');
    const canReset = isReady && _canReset;
    const _canStop = hooks.can('STOP');
    const canStop = isReady && _canStop;

    // Track service lifecycle & events

    const sendEvent = (event: Parameters<typeof service.send>[0]) => {
      return () => service.send(event);
    };

    const formattedStateValue = JSON.stringify(stateValue);

    return (
      <div className=' text-slate-100 font-sans p-4 sm:p-8'>
        <div className='max-w-7xl mx-auto space-y-8'>
          {/* Header Hero Section */}
          <div className='relative overflow-hidden rounded-3xl border border-slate-800 bg-linear-to-b from-slate-900/90 to-slate-950/80 p-8 shadow-2xl backdrop-blur-2xl'>
            <div className='absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl' />
            <div className='absolute bottom-0 left-1/3 -mb-16 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl' />

            <div className='relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6'>
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Badge variant='active' className='text-xs'>
                    <Sparkles className='w-3.5 h-3.5' /> React 19 +
                    TanStack Start
                  </Badge>
                  <Badge variant='purple' className='text-xs'>
                    <Cpu className='w-3.5 h-3.5' /> @bemedev/app &
                    @bemedev/app-reactjs
                  </Badge>
                </div>
                <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight bg-linear-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent'>
                  Visual State Machine Tester
                </h1>
                <p className='text-slate-400 max-w-2xl text-sm sm:text-base leading-relaxed'>
                  Test and inspect real-time state machine transitions with{' '}
                  <code className='text-emerald-400 font-mono'>
                    useService
                  </code>{' '}
                  from{' '}
                  <code className='text-teal-400 font-mono'>
                    @bemedev/app-reactjs
                  </code>
                  .
                </p>
              </div>

              {/* Service Status Card */}
              <div className='flex items-center gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-inner'>
                <div className='space-y-1'>
                  <div className='text-xs text-slate-400 font-medium'>
                    Interpreter Status
                  </div>
                  <div className='flex items-center gap-2'>
                    <span
                      className={`h-3 w-3 rounded-full ${canStop ? 'bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50' : 'bg-rose-500'}`}
                    />
                    <span className='font-semibold text-white capitalize'>
                      {fullState.status}
                    </span>
                  </div>
                </div>
                <div className='h-8 w-px bg-slate-800' />
                {isReady ? (
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
                )}
              </div>
            </div>
          </div>

          <MachineConfig
            config={counterMachine.config}
            title='Counter Machine Configuration'
            // class='rounded-md'
          />

          {/* Dashboard Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Column 1: Live State Cards */}
            <div className='space-y-6 lg:col-span-2'>
              {/* Live State Machine Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className='justify-between'>
                    <span className='flex items-center gap-2'>
                      <Activity className='w-5 h-5 text-emerald-400' />{' '}
                      State Inspector
                    </span>
                    <Badge
                      variant={
                        formattedStateValue.includes('speed_high')
                          ? 'purple'
                          : formattedStateValue.includes('speed_low')
                            ? 'active'
                            : 'secondary'
                      }
                    >
                      {formattedStateValue}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Current hierarchical state value and active tags
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* State Node Visual Display */}
                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                    <div
                      className={`p-4 rounded-xl border transition-all ${formattedStateValue === 'idle' ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md shadow-emerald-500/10' : 'bg-slate-900/40 border-slate-800 opacity-60'}`}
                    >
                      <div className='text-xs text-slate-400 mb-1'>
                        State 1
                      </div>
                      <div className='font-bold text-lg text-emerald-400'>
                        idle
                      </div>
                      <div className='text-xs text-slate-500 mt-2'>
                        Initial State
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-xl border transition-all ${formattedStateValue.includes('active') ? 'bg-teal-950/40 border-teal-500/50 shadow-md shadow-teal-500/10' : 'bg-slate-900/40 border-slate-800 opacity-60'}`}
                    >
                      <div className='text-xs text-slate-400 mb-1'>
                        State 2 (Nested)
                      </div>
                      <div className='font-bold text-lg text-teal-400'>
                        active
                      </div>
                      <div className='text-xs text-slate-400 mt-2 truncate'>
                        {formattedStateValue}
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-xl border transition-all ${formattedStateValue === 'final' ? 'bg-rose-950/40 border-rose-500/50 shadow-md shadow-rose-500/10' : 'bg-slate-900/40 border-slate-800 opacity-60'}`}
                    >
                      <div className='text-xs text-slate-400 mb-1'>
                        State 3
                      </div>
                      <div className='font-bold text-lg text-rose-400'>
                        final
                      </div>
                      <div className='text-xs text-slate-500 mt-2'>
                        Terminal State
                      </div>
                    </div>
                  </div>

                  {/* Active Tags */}
                  <div className='space-y-2'>
                    <div className='text-xs text-slate-400 font-medium flex items-center gap-1.5'>
                      <Layers className='w-3.5 h-3.5 text-slate-400' />{' '}
                      Active Tags:
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {tags.length > 0 ? (
                        tags.map(tag => (
                          <Badge
                            key={tag}
                            variant='blue'
                            className='text-xs'
                          >
                            #{tag}
                          </Badge>
                        ))
                      ) : (
                        <span className='text-xs text-slate-500 italic'>
                          No tags active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Context Counter Section */}
                  <div className='p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between'>
                    <div>
                      <div className='text-xs font-medium text-slate-400 uppercase tracking-wider'>
                        Context Counter
                      </div>
                      <div className='text-3xl font-extrabold text-white mt-1'>
                        {count}
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={sendEvent('DEC')}
                        disabled={!canStop}
                      >
                        <Minus className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='default'
                        size='icon'
                        onClick={sendEvent('INC')}
                        disabled={!canStop}
                      >
                        <Plus className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interactive State Transition Controller */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Zap className='w-5 h-5 text-amber-400' /> Dispatch
                    Events
                  </CardTitle>
                  <CardDescription>
                    Send events to trigger machine state transitions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                    <Button
                      variant='default'
                      onClick={sendEvent('START')}
                      disabled={!canStart}
                      className='flex space-x-2 min-w-max'
                    >
                      <Play className='w-4 h-4' /> ACTIVATE COUNTERS
                    </Button>

                    <Button
                      variant='secondary'
                      onClick={sendEvent('ACCELERATE')}
                      disabled={!canStop}
                      className='gap-2'
                    >
                      <Flame className='w-4 h-4 text-amber-400' />{' '}
                      ACCELERATE
                    </Button>

                    <Button
                      variant='secondary'
                      onClick={sendEvent('DECELERATE')}
                      disabled={!canStop}
                      className='gap-2'
                    >
                      <Gauge className='w-4 h-4 text-sky-400' /> DECELERATE
                    </Button>

                    <Button
                      variant='destructive'
                      onClick={sendEvent('STOP')}
                      disabled={!canStop}
                      className='flex space-x-2 min-w-max'
                    >
                      <Square className='w-4 h-4' /> STOP COUNTERS
                    </Button>
                  </div>

                  {canReset && (
                    <div className='mt-4 pt-4 border-t border-slate-800 flex justify-end'>
                      <Button
                        variant='outline'
                        onClick={sendEvent('RESET')}
                        className='gap-2 text-emerald-400 border-emerald-500/30'
                      >
                        <RotateCcw className='w-4 h-4' /> Reset Machine to
                        Idle
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Hook Selector Verification Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Code2 className='w-5 h-5 text-sky-400' /> useService
                    Hook Selectors
                  </CardTitle>
                  <CardDescription>
                    Demonstrates selective reactive re-rendering with
                    options.selector
                  </CardDescription>
                </CardHeader>
                <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2'>
                    <div className='text-xs text-sky-400 font-mono'>
                      useService(service, &#123; selector: s =&gt;
                      s.context.count &#125;)
                    </div>
                    <div className='text-sm font-semibold text-slate-200'>
                      Extracted Count:{' '}
                      <span className='text-white font-bold'>{count}</span>
                    </div>
                  </div>

                  <div className='p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2'>
                    <div className='text-xs text-teal-400 font-mono'>
                      useService(service, &#123; selector: s =&gt; s.value
                      &#125;)
                    </div>
                    <div className='text-sm font-semibold text-slate-200'>
                      State Value:{' '}
                      <span className='text-white font-bold'>
                        {formattedStateValue}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Column 2: Live Inspector & Event Audit Logs */}
            <div className='space-y-6'>
              {/* Raw JSON Inspector */}
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm flex items-center gap-2'>
                    <Code2 className='w-4 h-4 text-emerald-400' /> Full
                    State JSON
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className='p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-64 leading-relaxed'>
                    {JSON.stringify(fullState, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              {/* Event Transition Audit Log */}
              <Card className='flex flex-col'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm flex items-center justify-between'>
                    <span className='flex items-center gap-2'>
                      <History className='w-4 h-4 text-purple-400' />{' '}
                      Transition Log
                    </span>
                    <Badge
                      variant='secondary'
                      className='text-[10px] w-20 justify-center'
                    >
                      {logs.length} Events
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex-1'>
                  <div className='space-y-2 max-h-92.5 overflow-y-auto pr-1'>
                    {logs.length > 0 ? (
                      logs.map(log => (
                        <button
                          key={log.id}
                          className='p-3 rounded-lg bg-slate-950/70 border border-slate-800/60 text-xs flex items-center justify-between gap-2 w-full cursor-pointer'
                          onClick={sendEvent({
                            type: 'TOGGLE_LOG_EXPAND',
                            payload: log.id,
                          })}
                        >
                          <div className='space-y-0.5 flex-col'>
                            <div className='font-mono font-bold text-amber-300 text-start'>
                              {log.event}
                            </div>
                            <div
                              className={cn(
                                'text-slate-400 font-mono text-xs',
                                {
                                  'truncate max-w-[100px]': !log.expanded,
                                },
                                'text-start',
                              )}
                            >
                              → {JSON.stringify(log.state, null, 2)}
                            </div>
                          </div>
                          <div className='text-[10px] text-slate-500 font-mono shrink-0'>
                            {log.timestamp}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className='text-center py-8 text-slate-500 text-xs italic'>
                        No transitions logged yet. Start service and send
                        events!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
