import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BrainCircuit, LayoutDashboard, Mic, HandMetal, Globe, 
  MonitorPlay, ListTodo, LineChart, Settings 
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Voice Console', path: '/voice', icon: Mic },
  { name: 'Gesture Center', path: '/gesture', icon: HandMetal },
  { name: 'Browser Agent', path: '/browser', icon: Globe },
  { name: 'Desktop Agent', path: '/desktop', icon: MonitorPlay },
  { name: 'Task Queue', path: '/tasks', icon: ListTodo },
  { name: 'Analytics', path: '/analytics', icon: LineChart },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col h-full glass border-r border-white/30 dark:border-white/5 shadow-xl", className)}>
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-border/40">
        <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
          <BrainCircuit className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          VayuSync
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/15 text-primary shadow-sm before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-primary before:rounded-full" 
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )
            }
          >
            <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-105", "group-hover:text-primary")} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Engine Status */}
      <div className="p-4 m-3 rounded-xl glass bg-primary/5 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold">Neural Engine</p>
            <p className="text-[10px] text-muted-foreground">WebSocket Active</p>
          </div>
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_6px_#10b981]"></span>
          </div>
        </div>
      </div>
    </div>
  );
}