import type { Service } from '#/machines/counter';
import { useService } from '@bemedev/app-reactjs';
import { wrap } from '@bemedev/hook-wrapper';
import { History, RefreshCw } from 'lucide-react';
import {
  useLayoutEffect,
  useState as useReactState,
  type FC,
} from 'react';
import { Virtuoso } from 'react-virtuoso';
import { cn } from '../cn';
import { Badge } from './badge';
import { Card, CardHeader, CardTitle } from './card';

const EmptyPlaceholder: FC = () => (
  <div className='text-center py-8 text-slate-500 text-xs italic'>
    No transitions logged yet. Start service and send events!
  </div>
);

const ScrollSeekPlaceholder: FC = () => (
  <div className='text-center py-8 text-slate-500 text-xs italic'>
    This can scroll fast
  </div>
);

const LIMIT = 600;
const ITEMS_SIZE = 58;

type Props = { service: Service };

export const Logs = ({ service }: Props) => {
  const useState = useService(service).state;
  const Length = wrap.noParams(
    () => useState({ selector: s => s.context.logs.length }),
    len => (
      <Badge
        variant='secondary'
        className='text-[10px] w-28 justify-center'
      >
        New {len} Events
      </Badge>
    ),
  );

  const getLogs = () => service.context.logs;

  const [logs, _setLogs] = useReactState(getLogs);
  const setLogs = () => _setLogs(getLogs);

  const __length = logs.length;
  const [height, setHeight] = useReactState(60);

  useLayoutEffect(() => {
    if (__length > 0) {
      setHeight(() => {
        const previous = 3 + __length * ITEMS_SIZE;
        if (previous > LIMIT) return LIMIT;
        return previous;
      });
    }
  }, [__length]);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-sm flex items-center justify-between'>
          <span className='flex items-center gap-2'>
            <History className='w-4 h-4 text-purple-400' /> Transition Log
          </span>
          <button
            type='button'
            onClick={e => {
              e.stopPropagation();
              setLogs();
            }}
            className='px-2.5 py-1 text-xs font-sans rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer z-10'
            title='Fetch current machine state'
          >
            <RefreshCw className='w-3.5 h-3.5 text-yellow-700' />
            <span>fetch</span>
          </button>
          <Length />
        </CardTitle>
      </CardHeader>

      <Virtuoso
        data={logs}
        context={logs.length}
        className='overflow-y-auto pr-1 flex flex-col space-y-2'
        style={{ height }}
        fixedItemHeight={ITEMS_SIZE}
        computeItemKey={(_, log) => log.id}
        components={{
          EmptyPlaceholder,
          ScrollSeekPlaceholder,
          Item: ({ item, context, 'data-index': index }) => {
            const log10 = Math.log10(context) + 1;
            const __index = (context - index).toLocaleString();
            const _index = '#' + __index.padStart(log10, '0');

            return (
              <button
                className='px-2 py-3 rounded-lg bg-slate-950/70 border border-slate-800/60 text-xs flex items-center justify-between gap-2 w-full cursor-pointer'
                onClick={() =>
                  service.send({
                    type: 'TOGGLE_LOG_EXPAND',
                    payload: item.id,
                  })
                }
              >
                <div className='space-y-0.5 flex-col'>
                  <div className='font-mono font-bold text-amber-300 text-start'>
                    {_index} {' => '} {item.event}
                  </div>

                  <div
                    className={cn(
                      'text-slate-400 font-mono text-xs',
                      { 'truncate max-w-[100px]': !item.expanded },
                      'text-start',
                    )}
                  >
                    State → {JSON.stringify(item.state, null, 2)}
                  </div>
                </div>
                <div className='text-[10px] text-slate-500 font-mono shrink-0'>
                  {item.timestamp}
                </div>
              </button>
            );
          },
        }}
      />
    </Card>
  );
};

Logs.test = (({ service }) => {
  const useState = useService(service).state;
  const Length = wrap.noParams(
    () => useState({ selector: s => s.context.logs.length }),
    len => (
      <Badge
        variant='secondary'
        className='text-[10px] w-28 justify-center'
      >
        New {len} Events
      </Badge>
    ),
  );

  const logs = useState({ selector: s => s.context.logs });

  const __length = logs.length;
  const [height, setHeight] = useReactState(60);

  useLayoutEffect(() => {
    if (__length > 0) {
      setHeight(() => {
        const previous = 3 + __length * ITEMS_SIZE;
        if (previous > LIMIT) return LIMIT;
        return previous;
      });
    }
  }, [__length]);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-sm flex items-center justify-between'>
          <span className='flex items-center gap-2'>
            <History className='w-4 h-4 text-purple-400' /> Transition Log
          </span>

          <Length />
        </CardTitle>
      </CardHeader>

      <Virtuoso
        data={logs}
        context={logs.length}
        className='overflow-y-auto pr-1 flex flex-col space-y-2'
        style={{ height }}
        fixedItemHeight={ITEMS_SIZE}
        computeItemKey={(_, log) => log.id}
        components={{
          EmptyPlaceholder,
          ScrollSeekPlaceholder,
          Item: ({ item, context, 'data-index': index }) => {
            const log10 = Math.log10(context) + 1;
            const __index = (context - index).toLocaleString();
            const _index = '#' + __index.padStart(log10, '0');

            return (
              <button
                className='px-2 py-3 rounded-lg bg-slate-950/70 border border-slate-800/60 text-xs flex items-center justify-between gap-2 w-full cursor-pointer'
                onClick={() =>
                  service.send({
                    type: 'TOGGLE_LOG_EXPAND',
                    payload: item.id,
                  })
                }
              >
                <div className='space-y-0.5 flex-col'>
                  <div className='font-mono font-bold text-amber-300 text-start'>
                    {_index} {' => '} {item.event}
                  </div>

                  <div
                    className={cn(
                      'text-slate-400 font-mono text-xs',
                      { 'truncate max-w-[100px]': !item.expanded },
                      'text-start',
                    )}
                  >
                    State → {JSON.stringify(item.state, null, 2)}
                  </div>
                </div>
                <div className='text-[10px] text-slate-500 font-mono shrink-0'>
                  {item.timestamp}
                </div>
              </button>
            );
          },
        }}
      />
    </Card>
  );
}) as FC<{ service: Service }>;
