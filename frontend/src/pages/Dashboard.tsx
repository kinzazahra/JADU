import React, { useState } from 'react';
import { useAgentStore } from '@/store/useAgentStore';
import { Activity, Cpu, Database, Network, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  // 1. Pull the REAL cpu and memory strings from your WebSocket store
  const { isConnected, cpu, memory } = useAgentStore();
  
  // Clean up the CPU string (e.g., "15.2 %" -> 15.2) to drive the progress bar width
  const numericCpu = parseFloat(cpu) || 0;
  
  // Network ping is hardcoded here since psutil doesn't measure websocket latency directly,
  // but you can replace this later if you add a ping event to your WS router.
  const [networkPing] = useState(12); 

  const [activities] = useState([
    { id: 1, action: "Parsed natural language intent: 'Open Browser'", time: "Just now", status: "success" },
    { id: 2, action: "Executed PyAutoGUI shortcut: Win + T", time: "2 mins ago", status: "success" },
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview</h1>
          <p className="text-muted-foreground mt-1">Live telemetry and autonomous task execution.</p>
        </div>
        <div className="glass px-4 py-2 rounded-full flex items-center space-x-2 border border-white/60">
          <span className="relative flex h-2 w-2">
            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isConnected ? "bg-green-400" : "bg-destructive")}></span>
            <span className={cn("relative inline-flex rounded-full h-2 w-2", isConnected ? "bg-green-500" : "bg-destructive")}></span>
          </span>
          <span className="text-sm font-medium">{isConnected ? "Link Active" : "Link Disconnected"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-3xl p-8 spatial-card">
            <div className="flex items-center space-x-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">System Telemetry</h2>
            </div>

            <div className="space-y-8">
              {/* REAL CPU Tracker */}
              <div className="space-y-3 group cursor-default">
                <div className="flex justify-between items-end">
                  <div className="flex items-center space-x-2 text-muted-foreground group-hover:text-primary transition-colors duration-300">
                    <Cpu className="h-4 w-4" />
                    <span className="text-sm font-medium">Neural Engine (CPU)</span>
                  </div>
                  {/* Displays your actual backend CPU string */}
                  <span className="text-lg font-bold font-mono group-hover:scale-105 transition-transform duration-300">{cpu}</span>
                </div>
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out group-hover:shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                    style={{ width: `${numericCpu}%` }}
                  />
                </div>
              </div>

              {/* REAL Memory Tracker */}
              <div className="space-y-3 group cursor-default">
                <div className="flex justify-between items-end">
                  <div className="flex items-center space-x-2 text-muted-foreground group-hover:text-primary transition-colors duration-300">
                    <Database className="h-4 w-4" />
                    <span className="text-sm font-medium">Context Window (RAM)</span>
                  </div>
                  {/* Displays your actual backend Memory string (e.g. "8.4 GB") */}
                  <span className="text-lg font-bold font-mono group-hover:scale-105 transition-transform duration-300">{memory}</span>
                </div>
                {/* Visual bar sits at a static 50% for memory since it returns GB, not a percentage. */}
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `50%` }}
                  />
                </div>
              </div>

              {/* Network Tracker */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Network className="h-4 w-4" />
                    <span className="text-sm font-medium">WebSocket Latency</span>
                  </div>
                  <span className="text-lg font-bold font-mono">{networkPing}ms</span>
                </div>
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(networkPing / 50) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed Section */}
        <div className="glass rounded-3xl p-8 spatial-card flex flex-col h-[450px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Activity Feed</h2>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6 relative" style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}>
            {activities.map((item) => (
              <div key={item.id} className="flex items-start space-x-4 group">
                <div className="mt-1">
                  {item.status === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-primary" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                    {item.action}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}