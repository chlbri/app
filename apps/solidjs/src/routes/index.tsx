import { createHooks, useService } from '@bemedev/app-solidjs';
import { createFileRoute, Link } from '@tanstack/solid-router';

export const Route = createFileRoute('/')({
  component: () => {
    const counterService = Route.useRouteContext({
      select: s => s.counterService,
    })();

    const trafficService = Route.useRouteContext({
      select: s => s.trafficService,
    })();

    // SolidJS <accessors via @bemedev/app-solidjs
    const hooksCounter = useService(counterService);
    const hooksTraffic = createHooks(trafficService);
    const counterState = hooksCounter.state();
    const counterValue = hooksCounter.state({ selector: s => s.value });
    const canStartCounter = hooksCounter.can('START');
    const counterCount = () => counterState().context.count;
    const trafficState = hooksTraffic.state();
    const trafficTags = () => trafficState().tags;

    return (
      <div class='space-y-8'>
        {/* Hero Section */}
        <section class='relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-linear-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 p-8 shadow-2xl'>
          <div class='pointer-events-none absolute -top-12 -right-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl' />
          <div class='relative z-10 flex max-w-3xl flex-col space-y-4'>
            <span class='rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300'>
              TanStack Start + SolidJS Monorepo Integration
            </span>
            <h2 class='text-3xl font-extrabold tracking-tight text-white md:text-4xl'>
              {'Visual Tester for '}
              <span class='bg-linear-to-r from-indigo-400 via-pink-400 to-purple-400 bg-clip-text text-transparent'>
                @bemedev/app
              </span>
              {' & '}
              <span class='bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'>
                @bemedev/app-solidjs
              </span>
            </h2>
            <p class='text-sm leading-relaxed text-slate-300 md:text-base'>
              {
                'This application tests the reactivity middleware connecting '
              }
              <code class='font-mono text-pink-300'>@bemedev/app</code>
              {' state machines with SolidJS fine-grained signals using '}
              <code class='font-mono text-cyan-300'>useService</code>.
            </p>
          </div>
        </section>

        {/* Live Machine Cards Grid */}
        <div class='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Machine 1: Counter */}
          <div class='flex flex-col justify-between space-y-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur'>
            <div class='space-y-3'>
              <div class='flex items-center justify-between'>
                <span class='text-xs font-bold tracking-wider text-indigo-400 uppercase'>
                  Machine 01
                </span>
                <span class='rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 pt-0.5 pb-1 text-xs font-semibold text-emerald-300'>
                  {':: '}
                  {counterState().status}
                </span>
              </div>
              <h3 class='text-xl font-bold text-white'>
                Counter State Machine
              </h3>
              <p class='text-xs text-slate-400'>
                Tests basic transitions (
                <code class='font-mono text-indigo-300'>START</code>,{' '}
                <code class='font-mono text-indigo-300'>INC</code>,{' '}
                <code class='font-mono text-indigo-300'>DEC</code>,{' '}
                <code class='font-mono text-indigo-300'>STOP</code>) and
                reactive context accessors.
              </p>
            </div>

            <div class='space-y-3 rounded-xl border border-slate-800/80 bg-slate-950/80 p-4 font-mono text-xs'>
              <div class='flex items-center justify-between'>
                <span class='text-slate-500'>State Value:</span>
                <span class='rounded border border-indigo-800 bg-indigo-950 px-2 py-0.5 font-bold text-indigo-300'>
                  {JSON.stringify(counterValue())}
                </span>
              </div>
              <div class='flex items-center justify-between'>
                <span class='text-slate-500'>Count (via selector):</span>
                <span class='text-2xl font-black text-white'>
                  {counterCount()}
                </span>
              </div>
            </div>

            <div class='flex flex-wrap gap-2 pt-2'>
              <button
                onClick={() => counterService.send('INC')}
                class='cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95'
              >
                Send INC
              </button>
              <button
                onClick={() => counterService.send('DEC')}
                class='cursor-pointer rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-700 active:scale-95'
              >
                Send DEC
              </button>
              <button
                onClick={() =>
                  counterService.send(canStartCounter() ? 'START' : 'STOP')
                }
                class='cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 transition-all hover:bg-purple-500 active:scale-95'
              >
                {canStartCounter() ? 'Start Machine' : 'Stop Machine'}
              </button>
              <Link
                to='/counter'
                class='ml-auto rounded-lg px-3 py-2 text-xs font-semibold text-indigo-400 underline hover:text-indigo-300'
              >
                Full Test Route &rarr;
              </Link>
            </div>
          </div>

          {/* Machine 2: Traffic Light */}
          <div class='flex flex-col justify-between space-y-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur'>
            <div class='space-y-3'>
              <div class='flex items-center justify-between'>
                <span class='text-xs font-bold tracking-wider text-purple-400 uppercase'>
                  Machine 02
                </span>
                <div class='flex gap-3'>
                  <span class='rounded-full border border-purple-500/30 bg-purple-500/20 px-2.5 py-0.5 text-xs font-semibold text-purple-300'>
                    Nested States
                  </span>
                  <span class='rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 pt-0.5 pb-1 text-xs font-semibold text-emerald-300'>
                    {':: '}
                    {trafficState().status}
                  </span>
                </div>
              </div>
              <h3 class='text-xl font-bold text-white'>
                Traffic & Speed Machine
              </h3>
              <p class='text-xs text-slate-400'>
                Tests nested states (
                <code class='font-mono text-purple-300'>green.normal</code>
                , <code class='font-mono text-purple-300'>green.fast</code>
                ) and state tags.
              </p>
            </div>

            <div class='space-y-3 rounded-xl border border-slate-800/80 bg-slate-950/80 p-4 font-mono text-xs'>
              <div class='flex items-center justify-between'>
                <span class='text-slate-500'>State Value:</span>
                <span class='rounded border border-purple-800 bg-purple-950 px-2 py-0.5 font-bold text-purple-300'>
                  {JSON.stringify(trafficState().value)}
                </span>
              </div>
              <div class='flex items-center justify-between'>
                <span class='text-slate-500'>Active Tags:</span>
                <div class='flex flex-wrap gap-1'>
                  {trafficTags().map((tag: string) => (
                    <span class='rounded-full border border-purple-500/30 bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-300'>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div class='flex flex-wrap gap-2 pt-2'>
              <button
                onClick={() => trafficService.send('NEXT')}
                class='cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 transition-all hover:bg-purple-500 active:scale-95'
              >
                Send NEXT
              </button>

              <Link
                to='/traffic'
                class='ml-auto rounded-lg px-3 py-2 text-xs font-semibold text-purple-400 underline hover:text-purple-300'
              >
                Full Test Route &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
