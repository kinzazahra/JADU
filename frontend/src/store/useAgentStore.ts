import { create } from 'zustand';

interface AgentState {
  isConnected: boolean;
  cpu: string;
  memory: string;
  activeTask: string;
  detectedGesture: string;
  transcript: string;
  intent: any;
  sendCommand: (action: string, payload?: any) => void; // New Global Command Sender
  
  setIsConnected: (status: boolean) => void;
  updateSystemStats: (cpu: string, memory: string) => void;
  setActiveTask: (task: string) => void;
  setDetectedGesture: (gesture: string) => void;
  setVoiceData: (transcript: string, intent: any) => void;
  setSendCommand: (fn: (action: string, payload?: any) => void) => void; // Setter
}

export const useAgentStore = create<AgentState>((set) => ({
  isConnected: false,
  cpu: '-- %',
  memory: '-- GB',
  activeTask: 'Idle',
  detectedGesture: 'None',
  transcript: '',
  intent: null,
  sendCommand: () => console.warn("WebSocket not initialized yet"), // Default no-op
  
  setIsConnected: (status) => set({ isConnected: status }),
  updateSystemStats: (cpu, memory) => set({ cpu, memory }),
  setActiveTask: (task) => set({ activeTask: task }),
  setDetectedGesture: (gesture) => set({ detectedGesture: gesture }),
  setVoiceData: (transcript, intent) => set({ transcript, intent, activeTask: intent?.action || 'Idle' }),
  setSendCommand: (fn) => set({ sendCommand: fn }),
}));