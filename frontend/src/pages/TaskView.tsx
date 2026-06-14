import React, { useState } from 'react';
import { 
  ListTodo, 
  CheckCircle2, 
  Loader2, 
  Clock, 
  XCircle, 
  TerminalSquare, 
  Trash2, 
  Play,
  Pause,
  Server,
  MousePointer2,
  Globe,
  Mic
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Types for our mock task queue
type TaskStatus = 'completed' | 'in-progress' | 'pending' | 'failed';
type TaskType = 'desktop' | 'browser' | 'voice' | 'system';

interface Task {
  id: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  time: string;
  duration: string;
  logs: string[];
  payload: any;
}

export default function TaskView() {
  // Mock data representing the backend execution queue
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task-001',
      title: 'Open Chrome and go to Instagram',
      type: 'browser',
      status: 'completed',
      time: '10:45 AM',
      duration: '4.2s',
      logs: [
        '[INFO] Received intent: { action: "browser", target: "instagram.com" }',
        '[INFO] Initializing browser agent...',
        '[SUCCESS] Navigation to instagram.com complete.'
      ],
      payload: { action: "browser", steps: ["navigate"], target: "instagram.com" }
    },
    {
      id: 'task-002',
      title: 'Type text: "JADU is online."',
      type: 'desktop',
      status: 'in-progress',
      time: '10:48 AM',
      duration: '--',
      logs: [
        '[INFO] Received intent: { action: "desktop", type: "JADU is online." }',
        '[INFO] Engaging PyAutoGUI hardware simulation...',
        '[WAIT] Injecting keystrokes (0.05s interval)...'
      ],
      payload: { action: "desktop", steps: ["type"], target: "JADU is online." }
    },
    {
      id: 'task-003',
      title: 'Voice Command: "Analyze system stats"',
      type: 'voice',
      status: 'pending',
      time: '--',
      duration: '--',
      logs: ['[PENDING] Waiting for execution thread...'],
      payload: null
    },
    {
      id: 'task-004',
      title: 'Download latest model weights',
      type: 'system',
      status: 'failed',
      time: '09:12 AM',
      duration: '1.4s',
      logs: [
        '[INFO] Initiating download from HuggingFace...',
        '[ERROR] 503 Service Unavailable. Connection timed out.'
      ],
      payload: { endpoint: "huggingface.co/models", retries: 3 }
    }
  ]);

  const [selectedTaskId, setSelectedTaskId] = useState<string>('task-002');
  const [isQueuePaused, setIsQueuePaused] = useState(false);

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  const getStatusColor = (status: TaskStatus) => {
    switch(status) {
      case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'in-progress': return 'text-primary bg-primary/10 border-primary/20';
      case 'pending': return 'text-muted-foreground bg-secondary/50 border-border/50';
      case 'failed': return 'text-red-500 bg-red-500/10 border-red-500/20';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch(status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case 'pending': return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getTypeIcon = (type: TaskType) => {
    switch(type) {
      case 'desktop': return <MousePointer2 className="w-4 h-4" />;
      case 'browser': return <Globe className="w-4 h-4" />;
      case 'voice': return <Mic className="w-4 h-4" />;
      case 'system': return <Server className="w-4 h-4" />;
    }
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(t => t.status !== 'completed'));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 h-[calc(100vh-6rem)] flex flex-col pb-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-2xl glass flex items-center justify-center">
            <ListTodo className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Task Queue</h1>
            <p className="text-muted-foreground mt-1">Manage, monitor, and audit background agent executions.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsQueuePaused(!isQueuePaused)}
            className={`w-32 transition-all ${isQueuePaused ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-secondary/20 hover:bg-primary/10'}`}
          >
            {isQueuePaused ? <><Play className="w-4 h-4 mr-2" /> Resume</> : <><Pause className="w-4 h-4 mr-2" /> Pause Queue</>}
          </Button>
          <Button variant="outline" onClick={clearCompleted} className="bg-secondary/20 hover:bg-destructive/10 hover:text-destructive transition-all">
            <Trash2 className="w-4 h-4 mr-2" /> Clear Completed
          </Button>
        </div>
      </div>

      {/* Main Layout: Master/Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left Column: The Queue */}
        <div className="lg:col-span-1 glass rounded-3xl border border-border/50 flex flex-col overflow-hidden shadow-lg">
          <div className="p-4 border-b border-border/50 bg-secondary/30 flex items-center justify-between">
            <span className="font-semibold tracking-wide text-sm">Execution Order</span>
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-md">{tasks.length} Active</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {tasks.map((task) => (
              <div 
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                className={cn(
                  "p-3 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col gap-2",
                  selectedTaskId === task.id 
                    ? "bg-primary/10 border-primary/50 shadow-[0_0_15px_-3px_rgba(59,130,246,0.15)]" 
                    : "bg-secondary/10 border-border/20 hover:bg-secondary/30"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 font-medium text-sm text-foreground">
                    {getStatusIcon(task.status)}
                    <span className="line-clamp-1">{task.title}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider">
                    {getTypeIcon(task.type)}
                    <span>{task.type}</span>
                  </div>
                  <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm border", getStatusColor(task.status))}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Task Details */}
        <div className="lg:col-span-2 glass rounded-3xl border border-border/50 flex flex-col overflow-hidden shadow-lg relative">
          
          {selectedTask ? (
            <>
              {/* Detail Header */}
              <div className="p-6 border-b border-border/50 bg-secondary/10 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedTask.title}</h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Initiated: {selectedTask.time}</span>
                    <span className="flex items-center gap-1.5"><Server className="w-4 h-4" /> Duration: {selectedTask.duration}</span>
                  </div>
                </div>
                <div className={cn("px-3 py-1.5 rounded-lg border text-sm font-semibold uppercase tracking-wider flex items-center gap-2", getStatusColor(selectedTask.status))}>
                  {getStatusIcon(selectedTask.status)}
                  {selectedTask.status}
                </div>
              </div>

              {/* Detail Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* JSON Payload Section */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm font-semibold text-primary uppercase tracking-wide">
                    <TerminalSquare className="w-4 h-4" />
                    <span>Intent Payload</span>
                  </div>
                  <div className="bg-black/40 rounded-xl p-4 border border-border/50 overflow-x-auto">
                    <pre className="font-mono text-sm text-primary/80">
                      {selectedTask.payload ? JSON.stringify(selectedTask.payload, null, 2) : "// No payload generated for this task."}
                    </pre>
                  </div>
                </div>

                {/* Execution Logs Section */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm font-semibold text-foreground uppercase tracking-wide">
                    <ListTodo className="w-4 h-4" />
                    <span>System Logs</span>
                  </div>
                  <div className="bg-black/40 rounded-xl p-4 border border-border/50 min-h-[150px] space-y-2">
                    {selectedTask.logs.map((log, index) => {
                      const isError = log.includes('[ERROR]');
                      const isSuccess = log.includes('[SUCCESS]');
                      const isInfo = log.includes('[INFO]');
                      
                      return (
                        <div key={index} className="font-mono text-sm flex gap-3">
                          <span className="text-muted-foreground/50 select-none">0{index + 1}</span>
                          <span className={cn(
                            "break-all",
                            isError ? "text-red-400" : 
                            isSuccess ? "text-green-400" : 
                            isInfo ? "text-blue-400" : "text-muted-foreground"
                          )}>
                            {log}
                          </span>
                        </div>
                      )
                    })}
                    {selectedTask.status === 'in-progress' && (
                      <div className="font-mono text-sm flex gap-3 items-center mt-4 text-primary animate-pulse">
                        <span className="text-muted-foreground/50">--</span>
                        <span>_ Awaiting next instruction...</span>
                      </div>
                    )}
                  </div>
                </div>
                
              </div>
              
              {/* Task Actions Footer */}
              <div className="p-4 border-t border-border/50 bg-secondary/20 flex justify-end gap-3">
                {selectedTask.status === 'failed' && (
                  <Button variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Play className="w-4 h-4 mr-2" /> Retry Execution
                  </Button>
                )}
                {selectedTask.status === 'in-progress' && (
                  <Button variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30">
                    <XCircle className="w-4 h-4 mr-2" /> Terminate Process
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <ListTodo className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a task from the queue to view details.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}