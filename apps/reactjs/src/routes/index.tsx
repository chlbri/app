import { counterMachine } from '#/machines/counter';
import { cn } from '#/ui/cn';
import { Logs } from '#/ui/components/Logs';
import { MachineConfig } from '#/ui/components/MachineConfig';
import { Tags } from '#/ui/components/tags';
import { createFileRoute } from '@tanstack/react-router';
import {
  Activity,
  Code2,
  Cpu,
  Flame,
  Gauge,
  Layers,
  Minus,
  Plus,
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
import { useComponents } from './-index.components';

export const Route = createFileRoute('/')({
  component: () => {
    const service = Route.useRouteContext({
      select: s => s.counterService,
    });

    const {
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
    } = useComponents(service);

    return (
      <div className='p-4 font-sans text-slate-100 sm:p-8'>
        <div className='mx-auto max-w-7xl space-y-8'>
          {/* Header Hero Section */}
          <div className='relative overflow-hidden rounded-3xl border border-slate-800 bg-linear-to-b from-slate-900/90 to-slate-950/80 p-8 shadow-2xl backdrop-blur-2xl'>
            <div className='absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl' />
            <div className='absolute bottom-0 left-1/3 -mb-16 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl' />
            <div className='relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center'>
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Badge variant='active' className='text-xs'>
                    <Sparkles className='h-3.5 w-3.5' /> React 19 +
                    TanStack Start
                  </Badge>

                  <Badge variant='purple' className='text-xs'>
                    <Cpu className='h-3.5 w-3.5' /> @bemedev/app &
                    @bemedev/app-reactjs
                  </Badge>
                </div>

                <h1 className='bg-linear-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl'>
                  Visual State Machine Tester
                </h1>

                <p className='max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base'>
                  Test and inspect real-time state machine transitions with{' '}
                  <code className='font-mono text-emerald-400'>
                    useService
                  </code>{' '}
                  from{' '}
                  <code className='font-mono text-teal-400'>
                    @bemedev/app-reactjs
                  </code>
                  .
                </p>
              </div>

              {/* Service Status Card */}
              <div className='flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-inner'>
                <div className='space-y-1'>
                  <div className='text-xs font-medium text-slate-400'>
                    Interpreter Status
                  </div>
                  <div className='flex items-center gap-2'>
                    <CanStop
                      render={canStop => (
                        <span
                          className={cn(
                            'h-3 w-3 rounded-full',
                            canStop
                              ? 'bg-rose-500'
                              : 'bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50',
                          )}
                        />
                      )}
                    />
                    <Status />
                  </div>
                </div>

                <div className='h-8 w-px bg-slate-800' />
                <StartStop />
              </div>
            </div>
          </div>

          <MachineConfig
            config={counterMachine.config}
            title='Counter Machine Configuration'
          />

          {/* Dashboard Grid */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* Column 1: Live State Cards */}
            <div className='space-y-6 lg:col-span-2'>
              {/* Live State Machine Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className='justify-between'>
                    <span className='flex items-center gap-2'>
                      <Activity className='h-5 w-5 text-emerald-400' />{' '}
                      State Inspector
                    </span>
                    <StateValue
                      render={v => {
                        const variant = v.includes('speed_high')
                          ? 'purple'
                          : v.includes('speed_low')
                            ? 'active'
                            : 'secondary';

                        return <Badge variant={variant}>{v}</Badge>;
                      }}
                    />
                  </CardTitle>
                  <CardDescription>
                    Current hierarchical state value and active tags
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* State Node Visual Display */}
                  <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                    <StateIdle />
                    <StateActive />
                    <StateFinal />
                  </div>

                  {/* Active Tags */}
                  <div className='space-y-2'>
                    <div className='flex items-center gap-1.5 text-xs font-medium text-slate-400'>
                      <Layers className='h-3.5 w-3.5 text-slate-400' />{' '}
                      Active Tags:
                    </div>

                    <Tags {...{ service }} />
                  </div>

                  {/* Context Counter Section */}
                  <div className='flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-5'>
                    <div>
                      <div className='text-xs font-medium tracking-wider text-slate-400 uppercase'>
                        Context Counter
                      </div>
                      <div className='mt-1 text-3xl font-extrabold text-white'>
                        {<Count />}
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <CanStop
                        render={disabled => (
                          <Button
                            variant='outline'
                            size='icon'
                            onClick={sendEvent('DEC')}
                            disabled={disabled}
                          >
                            <Minus className='h-4 w-4' />
                          </Button>
                        )}
                      />

                      <CanStop
                        render={disabled => (
                          <Button
                            variant='default'
                            size='icon'
                            onClick={sendEvent('INC')}
                            disabled={disabled}
                          >
                            <Plus className='h-4 w-4' />
                          </Button>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interactive State Transition Controller */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Zap className='h-5 w-5 text-amber-400' /> Dispatch
                    Events
                  </CardTitle>
                  <CardDescription>
                    Send events to trigger machine state transitions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
                    <ActivateCounters />
                    <CanStop
                      render={disabled => (
                        <Button
                          variant='secondary'
                          onClick={sendEvent('ACCELERATE')}
                          disabled={disabled}
                          className='gap-2'
                        >
                          <Flame className='h-4 w-4 text-amber-400' />{' '}
                          ACCELERATE
                        </Button>
                      )}
                    />
                    <CanStop
                      render={disabled => (
                        <Button
                          variant='secondary'
                          onClick={sendEvent('DECELERATE')}
                          disabled={disabled}
                          className='gap-2'
                        >
                          <Gauge className='h-4 w-4 text-sky-400' />{' '}
                          DECELERATE
                        </Button>
                      )}
                    />
                    <CanStop
                      render={disabled => (
                        <Button
                          variant='destructive'
                          onClick={sendEvent('STOP')}
                          disabled={disabled}
                          className='flex min-w-max space-x-2'
                        >
                          <Square className='h-4 w-4' /> STOP COUNTERS
                        </Button>
                      )}
                    />
                  </div>

                  <Reset />
                </CardContent>
              </Card>

              {/* Hook Selector Verification Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Code2 className='h-5 w-5 text-sky-400' /> useService
                    Hook Selectors
                  </CardTitle>
                  <CardDescription>
                    Demonstrates selective reactive re-rendering with
                    options.selector
                  </CardDescription>
                </CardHeader>
                <CardContent className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-4'>
                    <div className='font-mono text-xs text-sky-400'>
                      useService(service, &#123; selector: s =&gt;
                      s.context.count &#125;)
                    </div>

                    <div className='text-sm font-semibold text-slate-200'>
                      Extracted Count:{' '}
                      <span className='font-bold text-white'>
                        {<Count />}
                      </span>
                    </div>
                    <div className='font-mono text-xs text-sky-400'>
                      useService(service, &#123; selector: s =&gt;
                      s.context.speed &#125;)
                    </div>
                    <div className='text-sm font-semibold text-slate-200'>
                      Extracted Speed:{' '}
                      <span className='font-bold text-white'>
                        {<Speed />}
                      </span>
                    </div>
                  </div>

                  <div className='space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-4'>
                    <div className='font-mono text-xs text-teal-400'>
                      useService(service, &#123; selector: s =&gt; s.value
                      &#125;)
                    </div>
                    <StateValue
                      render={v => (
                        <div className='text-sm font-semibold text-slate-200'>
                          State Value:{' '}
                          <span className='font-bold text-white'>{v}</span>
                        </div>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className='space-y-6'>
              {/* Raw JSON Inspector */}
              <FullStateWrapper />
              <Logs {...{ service }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
});
