import { createRouter as createTanStackRouter } from '@tanstack/solid-router';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultErrorComponent: err => (
      <div class='p-6 bg-red-950/80 text-red-200 rounded-xl border border-red-800 font-mono text-sm'>
        <h3 class='font-bold text-lg mb-2'>Router Error</h3>
        <pre class='overflow-x-auto whitespace-pre-wrap'>
          {err.error.stack ?? String(err.error)}
        </pre>
      </div>
    ),
    defaultNotFoundComponent: () => (
      <div class='p-12 text-center text-slate-400'>
        <h2 class='text-2xl font-bold text-slate-200 mb-2'>
          404 - Not Found
        </h2>
        <p>The requested route could not be found.</p>
      </div>
    ),
    scrollRestoration: true,
  });

  return router;
}
