import { createFileRoute } from '@tanstack/react-router';
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Database,
  Download,
  Globe,
  Plus,
  RotateCcw,
  Server,
  SlidersHorizontal,
  Trash2,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Panel,
  Position,
  addEdge,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type NodeProps,
  type OnConnect,
} from 'reactflow';

export const Route = createFileRoute('/')({
  component: GraphAppIndexPage,
});

// Custom Node Components
const ServiceNode = ({ data, selected }: NodeProps) => {
  const statusColors = {
    online: 'bg-emerald-500 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500 text-amber-400 border-amber-500/30',
    offline: 'bg-rose-500 text-rose-400 border-rose-500/30',
  };

  const statusIcons = {
    online: <CheckCircle2 className='h-3 w-3 text-emerald-400' />,
    warning: <AlertCircle className='h-3 w-3 text-amber-400' />,
    offline: <XCircle className='h-3 w-3 text-rose-400' />,
  };

  const statusKey = (data.status as keyof typeof statusColors) || 'online';

  return (
    <div
      className={`min-w-[200px] rounded-xl border bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur-md transition-all duration-200 ${
        selected
          ? 'glow-box-cyan border-cyan-400 ring-2 ring-cyan-500/30'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <Handle
        type='target'
        position={Position.Top}
        className='!-top-1.5 !h-3 !w-3 !bg-cyan-400'
      />
      <div className='mb-2 flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <div className='rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-2 text-cyan-400'>
            <Server className='h-4 w-4' />
          </div>
          <div>
            <div className='text-xs font-semibold tracking-wide text-slate-200'>
              {data.label}
            </div>
            <div className='font-mono text-[10px] text-slate-400'>
              {data.role || 'Microservice'}
            </div>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase ${statusColors[statusKey]}`}
        >
          {statusIcons[statusKey]}
          <span>{statusKey}</span>
        </div>
      </div>

      <div className='flex items-center justify-between rounded-md border border-slate-800/80 bg-slate-950/60 p-1.5 font-mono text-[11px] text-slate-400'>
        <span>Latency:</span>
        <span className='font-semibold text-cyan-300'>
          {data.latency || '12ms'}
        </span>
      </div>

      <Handle
        type='source'
        position={Position.Bottom}
        className='!-bottom-1.5 !h-3 !w-3 !bg-cyan-400'
      />
    </div>
  );
};

const DatabaseNode = ({ data, selected }: NodeProps) => {
  return (
    <div
      className={`min-w-[190px] rounded-xl border bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur-md transition-all duration-200 ${
        selected
          ? 'glow-box-purple border-purple-400 ring-2 ring-purple-500/30'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <Handle
        type='target'
        position={Position.Top}
        className='!-top-1.5 !h-3 !w-3 !bg-purple-400'
      />
      <div className='mb-2 flex items-center gap-2.5'>
        <div className='rounded-lg border border-purple-500/20 bg-purple-500/10 p-2 text-purple-400'>
          <Database className='h-4 w-4' />
        </div>
        <div>
          <div className='text-xs font-semibold tracking-wide text-slate-200'>
            {data.label}
          </div>
          <div className='font-mono text-[10px] text-purple-400'>
            {data.dbType || 'PostgreSQL'}
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between rounded-md border border-slate-800/80 bg-slate-950/60 p-1.5 font-mono text-[11px] text-slate-400'>
        <span>Active QPS:</span>
        <span className='font-semibold text-purple-300'>
          {data.qps || '4,200/s'}
        </span>
      </div>

      <Handle
        type='source'
        position={Position.Bottom}
        className='!-bottom-1.5 !h-3 !w-3 !bg-purple-400'
      />
    </div>
  );
};

const ApiNode = ({ data, selected }: NodeProps) => {
  return (
    <div
      className={`min-w-[210px] rounded-xl border bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur-md transition-all duration-200 ${
        selected
          ? 'glow-box-emerald border-emerald-400 ring-2 ring-emerald-500/30'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <Handle
        type='target'
        position={Position.Left}
        className='!-left-1.5 !h-3 !w-3 !bg-emerald-400'
      />
      <div className='mb-2 flex items-center gap-2.5'>
        <div className='rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-400'>
          <Globe className='h-4 w-4' />
        </div>
        <div>
          <div className='text-xs font-semibold tracking-wide text-slate-200'>
            {data.label}
          </div>
          <div className='font-mono text-[10px] text-emerald-400'>
            {data.endpoint || '/v1/api'}
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between rounded-md border border-slate-800/80 bg-slate-950/60 p-1.5 font-mono text-[11px] text-slate-400'>
        <span>Rate Limit:</span>
        <span className='font-semibold text-emerald-300'>
          {data.rate || '10k req/m'}
        </span>
      </div>

      <Handle
        type='source'
        position={Position.Right}
        className='!-right-1.5 !h-3 !w-3 !bg-emerald-400'
      />
      <Handle
        type='source'
        position={Position.Bottom}
        id='bottom'
        className='!-bottom-1.5 !h-3 !w-3 !bg-emerald-400'
      />
    </div>
  );
};

const AnalyticsNode = ({ data, selected }: NodeProps) => {
  return (
    <div
      className={`min-w-[200px] rounded-xl border bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur-md transition-all duration-200 ${
        selected
          ? 'glow-box-amber border-amber-400 ring-2 ring-amber-500/30'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <Handle
        type='target'
        position={Position.Top}
        className='!-top-1.5 !h-3 !w-3 !bg-amber-400'
      />
      <div className='mb-2 flex items-center gap-2.5'>
        <div className='rounded-lg border border-amber-500/20 bg-amber-500/10 p-2 text-amber-400'>
          <BarChart3 className='h-4 w-4' />
        </div>
        <div>
          <div className='text-xs font-semibold tracking-wide text-slate-200'>
            {data.label}
          </div>
          <div className='font-mono text-[10px] text-amber-400'>
            {data.stream || 'Kafka Telemetry'}
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between rounded-md border border-slate-800/80 bg-slate-950/60 p-1.5 font-mono text-[11px] text-slate-400'>
        <span>Events/sec:</span>
        <span className='font-semibold text-amber-300'>
          {data.events || '18.4K'}
        </span>
      </div>

      <Handle
        type='source'
        position={Position.Bottom}
        className='!-bottom-1.5 !h-3 !w-3 !bg-amber-400'
      />
    </div>
  );
};

// Initial topology dataset
const initialNodes: Node[] = [
  {
    id: 'api-gateway',
    type: 'apiNode',
    position: { x: 250, y: 80 },
    data: {
      label: 'API Gateway',
      endpoint: 'api.system.io',
      rate: '25k req/m',
    },
  },
  {
    id: 'auth-service',
    type: 'serviceNode',
    position: { x: 80, y: 240 },
    data: {
      label: 'Auth Service',
      role: 'OAuth2 / JWT',
      status: 'online',
      latency: '8ms',
    },
  },
  {
    id: 'user-service',
    type: 'serviceNode',
    position: { x: 420, y: 240 },
    data: {
      label: 'User Service',
      role: 'Profiles & Sync',
      status: 'online',
      latency: '14ms',
    },
  },
  {
    id: 'user-db',
    type: 'databaseNode',
    position: { x: 420, y: 420 },
    data: { label: 'Primary DB', dbType: 'PostgreSQL 16', qps: '8,450/s' },
  },
  {
    id: 'telemetry-stream',
    type: 'analyticsNode',
    position: { x: 140, y: 420 },
    data: {
      label: 'Event Telemetry',
      stream: 'Realtime Pipeline',
      events: '32.1k/s',
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'api-gateway',
    target: 'auth-service',
    animated: true,
    style: { stroke: '#38bdf8' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#38bdf8' },
  },
  {
    id: 'e1-3',
    source: 'api-gateway',
    target: 'user-service',
    animated: true,
    style: { stroke: '#38bdf8' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#38bdf8' },
  },
  {
    id: 'e3-4',
    source: 'user-service',
    target: 'user-db',
    animated: true,
    style: { stroke: '#c084fc' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#c084fc' },
  },
  {
    id: 'e2-5',
    source: 'auth-service',
    target: 'telemetry-stream',
    animated: true,
    style: { stroke: '#fbbf24' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#fbbf24' },
  },
];

function GraphAppIndexPage() {
  const [mounted, setMounted] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nodeTypes = useMemo(
    () => ({
      serviceNode: ServiceNode,
      databaseNode: DatabaseNode,
      apiNode: ApiNode,
      analyticsNode: AnalyticsNode,
    }),
    [],
  );

  const onConnect: OnConnect = useCallback(
    params =>
      setEdges(eds =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: '#38bdf8' },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#38bdf8' },
          },
          eds,
        ),
      ),
    [setEdges],
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleAddNode = (
    type: 'serviceNode' | 'databaseNode' | 'apiNode' | 'analyticsNode',
  ) => {
    const id = `node-${Date.now().toString().slice(-4)}`;
    const xPos = 200 + Math.floor(Math.random() * 200);
    const yPos = 150 + Math.floor(Math.random() * 200);

    const labelMap = {
      serviceNode: 'Payment Service',
      databaseNode: 'Cache DB',
      apiNode: 'Webhook Gateway',
      analyticsNode: 'Metric Collector',
    };

    const newNode: Node = {
      id,
      type,
      position: { x: xPos, y: yPos },
      data: {
        label: labelMap[type],
        status: 'online',
        role: 'Microservice',
        latency: '10ms',
        dbType: 'Redis Cluster',
        qps: '1,200/s',
        endpoint: '/v2/stream',
        rate: '5k req/m',
        stream: 'Kafka Queue',
        events: '5.2k/s',
      },
    };

    setNodes(nds => [...nds, newNode]);
  };

  const handleResetLayout = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSelectedNode(null);
  };

  const handleDeleteSelected = () => {
    if (!selectedNode) return;
    setNodes(nds => nds.filter(n => n.id !== selectedNode.id));
    setEdges(eds =>
      eds.filter(
        e => e.source !== selectedNode.id && e.target !== selectedNode.id,
      ),
    );
    setSelectedNode(null);
  };

  const handleUpdateNodeLabel = (newLabel: string) => {
    if (!selectedNode) return;
    setNodes(nds =>
      nds.map(n => {
        if (n.id === selectedNode.id) {
          return { ...n, data: { ...n.data, label: newLabel } };
        }
        return n;
      }),
    );
    setSelectedNode(prev =>
      prev ? { ...prev, data: { ...prev.data, label: newLabel } } : null,
    );
  };

  const handleUpdateNodeStatus = (
    newStatus: 'online' | 'warning' | 'offline',
  ) => {
    if (!selectedNode) return;
    setNodes(nds =>
      nds.map(n => {
        if (n.id === selectedNode.id) {
          return { ...n, data: { ...n.data, status: newStatus } };
        }
        return n;
      }),
    );
    setSelectedNode(prev =>
      prev ? { ...prev, data: { ...prev.data, status: newStatus } } : null,
    );
  };

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify({ nodes, edges }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'graph-app-topology.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!mounted) {
    return (
      <div className='flex h-screen w-screen flex-col items-center justify-center gap-4 bg-slate-950 text-slate-400'>
        <div className='flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400'>
          <Zap className='h-6 w-6' />
        </div>
        <div className='font-mono text-sm tracking-wide'>
          Loading ReactFlow 11.11.4 Canvas...
        </div>
      </div>
    );
  }

  return (
    <div className='relative m-0 h-screen w-screen overflow-hidden bg-slate-950 p-0 font-sans text-slate-100 selection:bg-cyan-500/30'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className='h-full w-full'
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color='#334155'
        />
        <Controls position='bottom-left' />
        <MiniMap
          position='bottom-right'
          nodeColor={n => {
            if (n.type === 'serviceNode') return '#38bdf8';
            if (n.type === 'databaseNode') return '#c084fc';
            if (n.type === 'apiNode') return '#34d399';
            if (n.type === 'analyticsNode') return '#fbbf24';
            return '#64748b';
          }}
          maskColor='rgba(15, 23, 42, 0.7)'
        />

        {/* Header Glass Overlay Panel */}
        <Panel position='top-left' className='!m-4'>
          <div className='flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/80 p-3 px-4 shadow-2xl backdrop-blur-xl'>
            <div className='rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 p-2 font-bold text-slate-950 shadow-lg shadow-cyan-500/20'>
              <Zap className='h-5 w-5' />
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <h1 className='text-base font-bold tracking-tight text-slate-100'>
                  Graph App
                </h1>
                <span className='rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan-400'>
                  reactflow@11.11.4
                </span>
                <span className='rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-purple-400'>
                  TanStack Start + Nitro
                </span>
              </div>
              <p className='text-xs font-medium text-slate-400'>
                Interactive full-page reactive graph canvas
              </p>
            </div>
          </div>
        </Panel>

        {/* Quick Toolbar Panel */}
        <Panel position='top-right' className='!m-4'>
          <div className='flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/80 p-2 shadow-2xl backdrop-blur-xl'>
            <button
              onClick={() => handleAddNode('serviceNode')}
              className='flex items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-200 shadow-sm transition-all hover:border-cyan-500/40 hover:bg-cyan-500/20 hover:text-cyan-300'
            >
              <Plus className='h-3.5 w-3.5 text-cyan-400' />
              <span>Service</span>
            </button>

            <button
              onClick={() => handleAddNode('databaseNode')}
              className='flex items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-200 shadow-sm transition-all hover:border-purple-500/40 hover:bg-purple-500/20 hover:text-purple-300'
            >
              <Plus className='h-3.5 w-3.5 text-purple-400' />
              <span>Database</span>
            </button>

            <button
              onClick={() => handleAddNode('apiNode')}
              className='flex items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-200 shadow-sm transition-all hover:border-emerald-500/40 hover:bg-emerald-500/20 hover:text-emerald-300'
            >
              <Plus className='h-3.5 w-3.5 text-emerald-400' />
              <span>API</span>
            </button>

            <div className='mx-1 h-6 w-px bg-slate-800' />

            <button
              onClick={handleResetLayout}
              title='Reset Graph'
              className='rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-800 hover:text-slate-200'
            >
              <RotateCcw className='h-4 w-4' />
            </button>

            <button
              onClick={handleExportJSON}
              title='Export Topology JSON'
              className='rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-800 hover:text-cyan-400'
            >
              <Download className='h-4 w-4' />
            </button>
          </div>
        </Panel>
      </ReactFlow>

      {/* Floating Node Inspector Drawer */}
      {selectedNode && (
        <div className='animate-in slide-in-from-right-4 absolute top-20 right-6 z-50 w-80 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-2xl duration-200'>
          <div className='mb-4 flex items-center justify-between border-b border-slate-800 pb-3'>
            <div className='flex items-center gap-2'>
              <SlidersHorizontal className='h-4 w-4 text-cyan-400' />
              <h3 className='text-sm font-semibold text-slate-100'>
                Node Inspector
              </h3>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className='rounded-lg p-1 text-slate-400 transition-all hover:bg-slate-800 hover:text-slate-200'
            >
              <X className='h-4 w-4' />
            </button>
          </div>

          <div className='space-y-4'>
            <div>
              <label className='mb-1.5 block font-mono text-xs tracking-wider text-slate-400 uppercase'>
                Node ID
              </label>
              <div className='rounded-xl border border-slate-800/80 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-300'>
                {selectedNode.id}
              </div>
            </div>

            <div>
              <label className='mb-1.5 block font-mono text-xs tracking-wider text-slate-400 uppercase'>
                Node Name
              </label>
              <input
                type='text'
                value={selectedNode.data.label || ''}
                onChange={e => handleUpdateNodeLabel(e.target.value)}
                className='w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-100 transition-all focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none'
              />
            </div>

            {selectedNode.type === 'serviceNode' && (
              <div>
                <label className='mb-1.5 block font-mono text-xs tracking-wider text-slate-400 uppercase'>
                  Health Status
                </label>
                <div className='grid grid-cols-3 gap-2'>
                  {(['online', 'warning', 'offline'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => handleUpdateNodeStatus(st)}
                      className={`rounded-lg border px-2 py-1.5 font-mono text-xs capitalize transition-all ${
                        selectedNode.data.status === st
                          ? 'border-cyan-500/40 bg-cyan-500/20 font-semibold text-cyan-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className='flex justify-end border-t border-slate-800/80 pt-2'>
              <button
                onClick={handleDeleteSelected}
                className='flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400 transition-all hover:bg-rose-500/20'
              >
                <Trash2 className='h-3.5 w-3.5' />
                <span>Delete Node</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
