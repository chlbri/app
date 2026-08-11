import { createRouter as createTanStackRouter } from '@tanstack/solid-router';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultErrorComponent: err => (
      <div class='rounded-xl border border-red-800 bg-red-950/80 p-6 font-mono text-sm text-red-200'>
        <h3 class='mb-2 text-lg font-bold'>Router Error</h3>
        <pre class='overflow-x-auto whitespace-pre-wrap'>
          {err.error.stack ?? String(err.error)}
        </pre>
      </div>
    ),
    defaultNotFoundComponent: () => (
      <div class='p-12 text-center text-slate-400'>
        <h2 class='mb-2 text-2xl font-bold text-slate-200'>
          404 - Not Found
        </h2>
        <p>The requested route could not be found.</p>
      </div>
    ),
    scrollRestoration: true,
  });

  return router;
}
