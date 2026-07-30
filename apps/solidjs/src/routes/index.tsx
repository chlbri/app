import { createFileRoute, Link } from '@tanstack/solid-router';
import { interpret } from '@bemedev/app';
import { useService } from '@bemedev/app-solidjs';
import { counterMachine } from '../machines/counter.machine';
import { trafficMachine } from '../machines/traffic.machine';
import { createSignal, onMount } from 'solid-js';

// Instantiate services
const counterService = interpret(counterMachine, {
  context: { count: 10, step: 1 },
});

const trafficService = interpret(trafficMachine, { context: { cycles: 0 } });

export const Route = createFileRoute('/')({
  component: () => {
    onMount(() => {
      counterService.start();
      trafficService.start();
    });

    // SolidJS accessors via @bemedev/app-solidjs
    const counterState = useService(counterService);
    const counterValue = useService(counterService, { selector: s => s.value });
    const counterCount = useService(counterService, { selector: s => s.context.count });
    
    const trafficState = useService(trafficService);
    const trafficTags = useService(trafficService, { selector: s => s.tags });

    return (
      <div class="space-y-8">
        {/* Hero Section */}
        <section class="p-8 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
          <div class="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div class="max-w-3xl relative z-10 space-y-4">
            <span class="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              TanStack Start + SolidJS Monorepo Integration
            </span>
            <h2 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Visual Tester for <span class="bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">@bemedev/app</span> & <span class="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">@bemedev/app-solidjs</span>
            </h2>
            <p class="text-slate-300 leading-relaxed text-sm md:text-base">
              This application tests the reactivity middleware connecting <code class="text-pink-300 font-mono">@bemedev/app</code> state machines with SolidJS fine-grained signals using <code class="text-cyan-300 font-mono">useService</code>.
            </p>
          </div>
        </section>

        {/* Live Machine Cards Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Machine 1: Counter */}
          <div class="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur shadow-xl space-y-5 flex flex-col justify-between">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">Machine 01</span>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {counterState().status}
                </span>
              </div>
              <h3 class="text-xl font-bold text-white">Counter State Machine</h3>
              <p class="text-xs text-slate-400">
                Tests basic transitions (<code class="text-indigo-300 font-mono">START</code>, <code class="text-indigo-300 font-mono">INC</code>, <code class="text-indigo-300 font-mono">DEC</code>, <code class="text-indigo-300 font-mono">STOP</code>) and reactive context accessors.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3 font-mono text-xs">
              <div class="flex justify-between items-center">
                <span class="text-slate-500">State Value:</span>
                <span class="text-indigo-300 font-bold px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800">
                  {JSON.stringify(counterValue())}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500">Count (via selector):</span>
                <span class="text-2xl font-black text-white">{counterCount()}</span>
              </div>
            </div>

            <div class="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => counterService.send('INC')}
                class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
              >
                Send INC
              </button>
              <button
                onClick={() => counterService.send('DEC')}
                class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95 cursor-pointer"
              >
                Send DEC
              </button>
              <button
                onClick={() => counterService.send(counterValue() === 'idle' ? 'START' : 'STOP')}
                class="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all active:scale-95 cursor-pointer"
              >
                {counterValue() === 'idle' ? 'Start Machine' : 'Stop Machine'}
              </button>
              <Link
                to="/counter"
                class="ml-auto px-3 py-2 rounded-lg text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline"
              >
                Full Test Route &rarr;
              </Link>
            </div>
          </div>

          {/* Machine 2: Traffic Light */}
          <div class="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur shadow-xl space-y-5 flex flex-col justify-between">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-purple-400">Machine 02</span>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Nested States
                </span>
              </div>
              <h3 class="text-xl font-bold text-white">Traffic & Speed Machine</h3>
              <p class="text-xs text-slate-400">
                Tests nested states (<code class="text-purple-300 font-mono">green.normal</code>, <code class="text-purple-300 font-mono">green.fast</code>) and state tags.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3 font-mono text-xs">
              <div class="flex justify-between items-center">
                <span class="text-slate-500">State Value:</span>
                <span class="text-purple-300 font-bold px-2 py-0.5 rounded bg-purple-950 border border-purple-800">
                  {JSON.stringify(trafficState().value)}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500">Active Tags:</span>
                <div class="flex flex-wrap gap-1">
                  {(Array.isArray(trafficTags()) ? (trafficTags() as string[]) : trafficTags() ? [trafficTags() as string] : []).map((tag: string) => (
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => trafficService.send('NEXT')}
                class="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all active:scale-95 cursor-pointer"
              >
                Send NEXT
              </button>
              {typeof trafficState().value === 'object' && (
                <button
                  onClick={() =>
                    trafficService.send(
                      (trafficState().value as any).green === 'normal' ? 'ACCELERATE' : 'SLOW_DOWN'
                    )
                  }
                  class="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-lg shadow-pink-600/30 transition-all active:scale-95 cursor-pointer"
                >
                  {(trafficState().value as any).green === 'normal' ? 'Accelerate' : 'Slow Down'}
                </button>
              )}
              <Link
                to="/traffic"
                class="ml-auto px-3 py-2 rounded-lg text-xs font-semibold text-purple-400 hover:text-purple-300 underline"
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
