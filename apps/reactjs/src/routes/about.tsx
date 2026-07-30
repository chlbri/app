import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Cpu, Layers, Sparkles, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-4 sm:p-8">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="purple">
                <Sparkles className="w-3.5 h-3.5" /> About @bemedev Workspace
              </Badge>
            </div>
            <CardTitle className="text-3xl font-extrabold text-white">
              Visual Testing App for State Machines
            </CardTitle>
            <CardDescription className="text-base text-slate-400">
              Built with TanStack Start, React 19, Tailwind CSS, and shadcn-inspired components.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-slate-300 leading-relaxed">
            <p>
              This app is designed to visually test and interact with <code className="text-emerald-400 font-mono">@bemedev/app</code> core state machine logic and its React middleware package <code className="text-teal-400 font-mono">@bemedev/app-reactjs</code> (<code className="text-teal-400 font-mono">useService</code>).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> State Selection
                </div>
                <p className="text-xs text-slate-400">
                  Selectively subscribe to sub-state context or state node values without unnecessary component re-renders.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" /> Deep Equality Comparison
                </div>
                <p className="text-xs text-slate-400">
                  Uses custom or built-in equality functions to ensure smooth state machine updates across nested states.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
