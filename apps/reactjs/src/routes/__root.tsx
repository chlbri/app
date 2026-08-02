import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import Footer from '../ui/components/Footer';
import Header from '../ui/components/Header';

import { counterService, type RootRouterContext } from '#/services';
import appCss from '../styles.css?url';

export const Route = createRootRouteWithContext<RootRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: '@bemedev/app-reactjs Visual Tester' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  }),

  context: () => ({ counterService }),

  shellComponent: ({ children }) => {
    return (
      <html lang='en' suppressHydrationWarning>
        <head>
          <HeadContent />
        </head>
        <body className='font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)] flex flex-col min-h-screen bg-slate-950/80'>
          <Header />
          <div className='flex-1'>{children}</div>
          <Footer />

          <Scripts />
        </body>
      </html>
    );
  },
});
