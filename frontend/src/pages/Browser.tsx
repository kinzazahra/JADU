import React, { useState } from 'react';
import { useAgentStore } from '@/store/useAgentStore';
import { Globe, ArrowRight, MousePointerClick, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Browser() {
  const { sendCommand } = useAgentStore();
  const [url, setUrl] = useState('google.com');

  const handleNavigate = () => {
    sendCommand('browser_action', { 
      intent: { action: 'browser', steps: ['open_url'], target: url } 
    });
  };

  const handleScreenshot = () => {
    sendCommand('browser_action', { 
      intent: { action: 'browser', steps: ['screenshot'], target: url } 
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Browser Agent</h1>
        <p className="text-muted-foreground mt-1">Autonomous web navigation and DOM manipulation engine.</p>
      </div>

      <div className="glass p-6 rounded-xl border border-border/50 shadow-sm space-y-6">
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-9 bg-background/50" 
              placeholder="Enter target URL or web command..." 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button onClick={handleNavigate} className="px-8">
            Engage <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border/50 pt-6">
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2 bg-secondary/20 hover:bg-primary/10">
            <MousePointerClick className="h-6 w-6 text-primary" />
            <span>Smart Click</span>
          </Button>
          
          <Button variant="outline" onClick={handleScreenshot} className="h-24 flex flex-col items-center justify-center space-y-2 bg-secondary/20 hover:bg-primary/10">
            <ImageIcon className="h-6 w-6 text-primary" />
            <span>Extract Screenshot</span>
          </Button>
        </div>
      </div>
    </div>
  );
}