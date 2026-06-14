import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service here
    console.error('JADU UI Engine Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
          <div className="glass p-8 rounded-2xl w-full max-w-2xl border-destructive/30 border shadow-lg space-y-6">
            <div className="flex items-center space-x-4 border-b border-border/50 pb-4">
              <div className="h-12 w-12 bg-destructive/10 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">UI Engine Fault Detected</h1>
                <p className="text-sm text-muted-foreground">The application caught an unexpected rendering error.</p>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <p className="text-destructive font-semibold mb-2">Error Details:</p>
              <pre className="text-muted-foreground whitespace-pre-wrap">
                {this.state.error?.message || 'Unknown error occurred'}
              </pre>
            </div>

            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
              variant="outline"
            >
              <RefreshCcw className="mr-2 h-4 w-4" /> Reboot JADU Interface
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}