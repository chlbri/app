/// <reference types="vite/client" />

import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/solid-router';
import { HydrationScript } from 'solid-js/web';
import appCss from '../app.css?url';
import {
  counterService,
  trafficService,
  type RootRouterContext,
} from '../services';

export const Route = createRootRouteWithContext<RootRouterContext>()({
  head: () => ({
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: '@bemedev/app-solidjs Visual Tester' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  }),

  context: () => {
    counterService.start();
    trafficService.start();
    return { counterService, trafficService };
  },

  shellComponent: ({ children }) => {
    return (
      <html lang='en'>
        <head>
          <HydrationScript />
        </head>
        <body class='min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-indigo-500 selection:text-white'>
          <HeadContent />

          {/* Navigation Bar */}
          <header class='sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 px-6 py-4 backdrop-blur-md'>
            <div class='mx-auto flex max-w-7xl items-center justify-between'>
              <div class='flex items-center space-x-3'>
                <div class='flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 text-lg font-black text-white shadow-lg shadow-indigo-500/25'>
                  ⚡
                </div>
                <div>
                  <h1 class='bg-linear-to-r from-indigo-300 via-white to-purple-300 bg-clip-text text-base font-bold text-transparent'>
                    @bemedev/app-solidjs
                  </h1>
                  <p class='text-xs text-slate-400'>
                    TanStack Start Visual Tester
                  </p>
                </div>
              </div>

              <nav class='flex items-center space-x-2'>
                <Link
                  to='/'
                  activeProps={{
                    class:
                      'bg-indigo-600/30 text-indigo-300 border-indigo-500/50',
                  }}
                  inactiveProps={{
                    class:
                      'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent',
                  }}
                  class='rounded-lg border px-3.5 py-1.5 text-sm font-medium transition-all'
                  activeOptions={{ exact: true }}
                >
                  Overview
                </Link>
                <Link
                  to='/counter'
                  activeProps={{
                    class:
                      'bg-indigo-600/30 text-indigo-300 border-indigo-500/50',
                  }}
                  inactiveProps={{
                    class:
                      'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent',
                  }}
                  class='rounded-lg border px-3.5 py-1.5 text-sm font-medium transition-all'
                >
                  Counter Machine
                </Link>
                <Link
                  to='/traffic'
                  activeProps={{
                    class:
                      'bg-indigo-600/30 text-indigo-300 border-indigo-500/50',
                  }}
                  inactiveProps={{
                    class:
                      'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent',
                  }}
                  class='rounded-lg border px-3.5 py-1.5 text-sm font-medium transition-all'
                >
                  Nested Traffic Machine
                </Link>
              </nav>
            </div>
          </header>

          <main class='mx-auto max-w-7xl p-4'>{children}</main>
          <Scripts />
        </body>
      </html>
    );
  },
});
