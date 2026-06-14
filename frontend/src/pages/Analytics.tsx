import React from 'react';
import { useAgentStore } from '@/store/useAgentStore';
import { 
  Activity, 
  Clock, 
  Server, 
  Cpu, 
  Network, 
  CheckCircle2, 
  Loader2, 
  Terminal, 
  Settings, 
  MousePointer2,
  Keyboard,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Analytics() {
  // Pull the live data from your store (with fallbacks just in case)
  const agentState = useAgentStore();
  const cpuUsage = (agentState as any).cpuUsage || '0%';
  const memoryUsage = (agentState as any).memoryUsage || '0 GB';
  const isOnline = (agentState as any).isOnline || false;

  // Mock data for the task queue
  const taskQueue = [
    { id: 1, type: "desktop", task: "Opened Start Menu", status: "completed", time: "2m ago", icon: MousePointer2 },
    { id: 2, type: "keyboard", task: "Injected text block", status: "completed", time: "15m ago", icon: Keyboard },
    { id: 3, type: "browser", task: "Navigated to github.com", status: "completed", time: "1h ago", icon: Globe },
    { id: 4, type: "system", task: "Waiting for next command...", status: "pending", time: "now", icon: Loader2 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500 pb-10">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Analytics</h1>
          <p className="text-muted-foreground mt-1">Real-time telemetry, task history, and agent performance.</p>
        </div>
        <div className="flex items-center gap-3 bg-secondary/20 border border-border/50 px-4 py-2 rounded-lg">
          <span className={`flex h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-500'}`}></span>
          <span className={`text-sm font-medium ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
            {isOnline ? 'Agent Online' : 'Agent Offline'}
          </span>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass p-6 rounded-xl border border-border/50 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Cpu className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Host CPU Usage</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{cpuUsage}</p>
          <p className="text-xs text-muted-foreground">Live from psutil</p>
        </div>

        <div className="glass p-6 rounded-xl border border-border/50 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Server className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">System Memory</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{memoryUsage}</p>
          <p className="text-xs text-muted-foreground">Active RAM allocated</p>
        </div>

        <div className="glass p-6 rounded-xl border border-border/50 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Activity className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Commands Executed</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">1,204</p>
          <p className="text-xs text-muted-foreground">+34 this session</p>
        </div>

        <div className="glass p-6 rounded-xl border border-border/50 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Network className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">WebSocket Latency</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">42ms</p>
          <p className="text-xs text-muted-foreground">Local network connection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Task Queue Column */}
        <div className="lg:col-span-2 glass p-6 rounded-xl border border-border/50 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Execution Queue
            </h2>
            <Button variant="outline" size="sm" className="h-8 text-xs bg-background/50 border-border/50">
              Clear History
            </Button>
          </div>

          <div className="space-y-4 flex-1">
            {taskQueue.map((task) => {
              const Icon = task.icon;
              return (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/10 border border-border/20 hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-md ${task.status === 'pending' ? 'bg-primary/20 text-primary' : 'bg-background/50 text-muted-foreground'}`}>
                      <Icon className={`w-5 h-5 ${task.status === 'pending' && 'animate-spin'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{task.task}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{task.type}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {task.status === 'completed' ? (
                      <span className="flex items-center gap-1 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-md">
                        <CheckCircle2 className="w-3 h-3" /> Success
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-md">
                        In Progress
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">{task.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Settings & Logs Column */}
        <div className="space-y-6">
          
          {/* Quick Settings */}
          <div className="glass p-6 rounded-xl border border-border/50">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-primary" /> Agent Configuration
            </h2>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-between text-muted-foreground hover:text-foreground hover:bg-secondary/20">
                <span>Hardware Simulation</span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Enabled</span>
              </Button>
              <Button variant="ghost" className="w-full justify-between text-muted-foreground hover:text-foreground hover:bg-secondary/20">
                <span>Failsafe Trigger</span>
                <span className="text-xs bg-secondary/50 text-muted-foreground px-2 py-0.5 rounded">Corners</span>
              </Button>
              <Button variant="ghost" className="w-full justify-between text-muted-foreground hover:text-foreground hover:bg-secondary/20">
                <span>Typing Delay</span>
                <span className="text-xs bg-secondary/50 text-muted-foreground px-2 py-0.5 rounded">0.05s</span>
              </Button>
            </div>
          </div>

          {/* Terminal Output Mini */}
          <div className="glass p-6 rounded-xl border border-border/50 bg-black/40">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground flex items-center gap-2 mb-4">
              <Terminal className="w-4 h-4 text-primary" /> Live Output
            </h2>
            <div className="font-mono text-xs text-muted-foreground space-y-2 h-32 overflow-y-auto">
              <p><span className="text-green-400">[INFO]</span> WebSocket connected.</p>
              <p><span className="text-green-400">[INFO]</span> Initializing PyAutoGUI...</p>
              <p><span className="text-blue-400">[ACTION]</span> Recv: {'{ action: "shortcut", keys: "win" }'}</p>
              <p><span className="text-green-400">[INFO]</span> Executed shortcut successfully.</p>
              <p className="animate-pulse">_</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}