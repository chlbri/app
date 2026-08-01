/// <reference types="vite/client" />

import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/solid-router';
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools';
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

  beforeLoad: ({ context: { counterService, trafficService } }) => {
    counterService?.start();
    trafficService?.start();
  },

  context: () => ({ counterService, trafficService }),

  component: () => {
    return (
      <html lang='en'>
        <head>
          <HydrationScript />
        </head>
        <body class='bg-slate-950 text-slate-100 min-h-screen font-sans antialiased selection:bg-indigo-500 selection:text-white'>
          <HeadContent />

          {/* Navigation Bar */}
          <header class='sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-4'>
            <div class='max-w-7xl mx-auto flex items-center justify-between'>
              <div class='flex items-center space-x-3'>
                <div class='h-9 w-9 rounded-xl bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/25'>
                  ⚡
                </div>
                <div>
                  <h1 class='text-base font-bold bg-linear-to-r from-indigo-300 via-white to-purple-300 bg-clip-text text-transparent'>
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
                  class='px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all'
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
                  class='px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all'
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
                  class='px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all'
                >
                  Nested Traffic Machine
                </Link>
              </nav>
            </div>
          </header>

          <main class='max-w-7xl mx-auto p-4'>
            <Outlet />
          </main>

          <TanStackRouterDevtools />
          <Scripts />
        </body>
      </html>
    );
  },
});
