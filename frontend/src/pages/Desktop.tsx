import React, { useState } from 'react';
import { useAgentStore } from '@/store/useAgentStore';
import { 
  Keyboard, 
  MousePointer2, 
  Volume2, 
  VolumeX, 
  AppWindow, 
  Power, 
  Command,
  Loader2 // <-- Added for the loading spinner
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Desktop() {
  const { sendCommand } = useAgentStore();
  const [textToType, setTextToType] = useState('JADU is online.');
  
  // State to track if we are currently sending text
  const [isInjecting, setIsInjecting] = useState(false);

  const handleType = () => {
    if (!textToType.trim() || isInjecting) return;
    
    setIsInjecting(true);

    // Send the command to PyAutoGUI backend
    sendCommand('desktop_action', { 
      intent: { action: 'desktop', steps: ['type'], target: textToType } 
    });

    // Reset button UI and clear input after a short delay
    setTimeout(() => {
      setIsInjecting(false);
      setTextToType(''); // Clear the input field for the next message
    }, 800); 
  };

  const handleShortcut = (keys: string) => {
    sendCommand('desktop_action', { 
      intent: { action: 'desktop', steps: ['shortcut'], target: keys } 
    });
  };

  const handleClick = () => {
    sendCommand('desktop_action', { 
      intent: { action: 'desktop', steps: ['click'] } 
    });
  };

  const handleStartMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleShortcut('win'); 
  };

  const handleTaskView = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleShortcut('win+tab');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Desktop Agent</h1>
        <p className="text-muted-foreground mt-1">Direct operating system manipulation via PyAutoGUI hardware simulation.</p>
      </div>

      <div className="glass p-8 rounded-xl border border-border/50 shadow-sm space-y-8">
        
        {/* Keystroke Injection Pipeline */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Text Injection Pipeline</h2>
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Keyboard className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10 h-11 bg-background/50" 
                placeholder="Text to simulate typing globally..." 
                value={textToType}
                onChange={(e) => setTextToType(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleType();
                }}
                disabled={isInjecting} // Disable input while injecting
              />
            </div>
            
            {/* Upgraded Button with Loading State */}
            <Button 
              onClick={handleType} 
              disabled={isInjecting || !textToType.trim()} 
              className="h-11 px-8 shadow-sm w-48 transition-all"
            >
              {isInjecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Injecting...
                </>
              ) : (
                'Inject Keystrokes'
              )}
            </Button>

          </div>
        </div>

        {/* System Quick Actions Grid */}
        <div className="space-y-3 pt-4 border-t border-border/50">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">System Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <Button variant="outline" onClick={handleStartMenu} className="h-28 flex flex-col items-center justify-center space-y-3 bg-secondary/20 hover:bg-primary/10 transition-all">
              <Command className="h-7 w-7 text-primary" />
              <span className="font-medium text-sm">Start Menu</span>
            </Button>
            
            <Button variant="outline" onClick={handleTaskView} className="h-28 flex flex-col items-center justify-center space-y-3 bg-secondary/20 hover:bg-primary/10 transition-all">
              <AppWindow className="h-7 w-7 text-primary" />
              <span className="font-medium text-sm">Task View</span>
            </Button>

            <Button variant="outline" onClick={() => handleShortcut('ctrl+t')} className="h-28 flex flex-col items-center justify-center space-y-3 bg-secondary/20 hover:bg-primary/10 transition-all">
              <AppWindow className="h-7 w-7 text-primary" />
              <span className="font-medium text-sm">New Tab</span>
            </Button>

            <Button variant="outline" onClick={() => handleShortcut('ctrl+w')} className="h-28 flex flex-col items-center justify-center space-y-3 bg-secondary/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all">
              <Power className="h-7 w-7" />
              <span className="font-medium text-sm">Close Window</span>
            </Button>

            <Button variant="outline" onClick={() => handleShortcut('volumeup')} className="h-28 flex flex-col items-center justify-center space-y-3 bg-secondary/20 hover:bg-primary/10 transition-all">
              <Volume2 className="h-7 w-7 text-primary" />
              <span className="font-medium text-sm">Volume Up</span>
            </Button>

            <Button variant="outline" onClick={() => handleShortcut('volumedown')} className="h-28 flex flex-col items-center justify-center space-y-3 bg-secondary/20 hover:bg-primary/10 transition-all">
              <Volume2 className="h-7 w-7 text-primary" />
              <span className="font-medium text-sm">Volume Down</span>
            </Button>

            <Button variant="outline" onClick={() => handleShortcut('volumemute')} className="h-28 flex flex-col items-center justify-center space-y-3 bg-secondary/20 hover:bg-primary/10 transition-all">
              <VolumeX className="h-7 w-7 text-primary" />
              <span className="font-medium text-sm">Mute Audio</span>
            </Button>

            <Button variant="outline" onClick={handleClick} className="h-28 flex flex-col items-center justify-center space-y-3 bg-secondary/20 hover:bg-primary/10 transition-all">
              <MousePointer2 className="h-7 w-7 text-primary" />
              <span className="font-medium text-sm">Primary Click</span>
            </Button>

          </div>
        </div>

      </div>
    </div>
  );
}