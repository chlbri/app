import { useState } from '@bemedev/app-reactjs';
import { useRouteContext } from '@tanstack/react-router';
import { History } from 'lucide-react';
import { useRef, type FC } from 'react';
import { cn } from '../cn';
import { Badge } from './badge';
import { Card, CardContent, CardHeader, CardTitle } from './card';

export const Logs: FC = () => {
  const service = useRouteContext({
    from: '__root__',
    select: s => s.counterService,
  });

  const logs = useState(service, { selector: s => s.context.logs });
  const parentRef = useRef(null);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-sm flex items-center justify-between'>
          <span className='flex items-center gap-2'>
            <History className='w-4 h-4 text-purple-400' /> Transition Log
          </span>
          <Badge
            variant='secondary'
            className='text-[10px] w-24 justify-center'
          >
            {logs.length} Events
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent
        className='flex-1 overflow-y-auto pr-1  max-h-92.5'
        ref={parentRef}
      >
        <div className='flex flex-col space-y-2 '>
          {logs.length > 0 ? (
            logs.map((log, index, all) => {
              const _index =
                '#' +
                (all.length - index)
                  .toLocaleString()
                  .padStart(Math.log10(all.length) + 1, '0');
              return (
                <button
                  key={log.id}
                  className='p-3 rounded-lg bg-slate-950/70 border border-slate-800/60 text-xs flex items-center justify-between gap-2 w-full cursor-pointer'
                  onClick={() =>
                    service.send({
                      type: 'TOGGLE_LOG_EXPAND',
                      payload: log.id,
                    })
                  }
                >
                  <div className='space-y-0.5 flex-col'>
                    <div className='font-mono font-bold text-amber-300 text-start'>
                      {_index}
                      {' => '}
                      {log.event}
                    </div>
                    <div
                      className={cn(
                        'text-slate-400 font-mono text-xs',
                        { 'truncate max-w-[100px]': !log.expanded },
                        'text-start',
                      )}
                    >
                      → {JSON.stringify(log.state, null, 2)}
                    </div>
                  </div>
                  <div className='text-[10px] text-slate-500 font-mono shrink-0'>
                    {log.timestamp}
                  </div>
                </button>
              );
            })
          ) : (
            <div className='text-center py-8 text-slate-500 text-xs italic'>
              No transitions logged yet. Start service and send events!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
