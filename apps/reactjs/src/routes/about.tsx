import { createFileRoute } from '@tanstack/react-router';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { Badge } from '../ui/components/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/components/card';

export const Route = createFileRoute('/about')({
  component: () => {
    return (
      <main className='mx-auto h-full max-w-4xl p-4 font-sans text-slate-100 sm:p-8'>
        <Card className='p-4 sm:p-8'>
          <CardHeader>
            <div className='mb-2 flex items-center gap-2'>
              <Badge variant='purple'>
                <Sparkles className='h-3.5 w-3.5' /> About @bemedev
                Workspace
              </Badge>
            </div>
            <CardTitle className='text-3xl font-extrabold text-white'>
              Visual Testing App for State Machines
            </CardTitle>
            <CardDescription className='text-base text-slate-400'>
              Built with TanStack Start, React 19, Tailwind CSS, and
              shadcn-inspired components.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6 text-sm leading-relaxed text-slate-300'>
            <p>
              This app is designed to visually test and interact with{' '}
              <code className='font-mono text-emerald-400'>
                @bemedev/app
              </code>{' '}
              core state machine logic and its React middleware package{' '}
              <code className='font-mono text-teal-400'>
                @bemedev/app-reactjs
              </code>{' '}
              (<code className='font-mono text-teal-400'>useService</code>
              ).
            </p>

            <div className='grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2'>
              <div className='space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-4'>
                <div className='flex items-center gap-2 font-semibold text-white'>
                  <CheckCircle2 className='h-4 w-4 text-emerald-400' />{' '}
                  State Selection
                </div>
                <p className='text-xs text-slate-400'>
                  Selectively subscribe to sub-state context or state node
                  values without unnecessary component re-renders.
                </p>
              </div>

              <div className='space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-4'>
                <div className='flex items-center gap-2 font-semibold text-white'>
                  <CheckCircle2 className='h-4 w-4 text-teal-400' /> Deep
                  Equality Comparison
                </div>
                <p className='text-xs text-slate-400'>
                  Uses custom or built-in equality functions to ensure
                  smooth state machine updates across nested states.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  },
});
