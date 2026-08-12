import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router';

import appCss from '../styles.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Graph App - ReactFlow Visualizer' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),

  shellComponent: ({ children }) => {
    return (
      <html
        lang='en'
        className='dark h-full w-full overflow-hidden'
        suppressHydrationWarning
        suppressContentEditableWarning
      >
        <head>
          <HeadContent />
        </head>
        <body className='m-0 h-screen w-screen overflow-hidden bg-slate-950 p-0 font-sans text-slate-100 antialiased selection:bg-cyan-500/30'>
          {children}
          <Scripts />
        </body>
      </html>
    );
  },
  component: () => <Outlet />,
});
