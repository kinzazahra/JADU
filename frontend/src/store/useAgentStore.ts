import { create } from 'zustand';

interface AgentState {
  isConnected: boolean;
  cpu: string;
  memory: string;
  activeTask: string;
  detectedGesture: string;
  transcript: string;
  intent: any;
  isProcessingVoice: boolean; // <-- Tracks the loading state globally
  
  sendCommand: (action: string, payload?: any) => void; 
  setIsConnected: (status: boolean) => void;
  updateSystemStats: (cpu: string, memory: string) => void;
  setActiveTask: (task: string) => void;
  setDetectedGesture: (gesture: string) => void;
  setVoiceData: (transcript: string, intent: any) => void;
  setVoiceProcessing: (status: boolean) => void; // <-- Setter for loading
  clearVoiceData: () => void; // <-- Clears old text when you start speaking
  setSendCommand: (fn: (action: string, payload?: any) => void) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  isConnected: false,
  cpu: '-- %',
  memory: '-- GB',
  activeTask: 'Idle',
  detectedGesture: 'None',
  transcript: '',
  intent: null,
  isProcessingVoice: false,
  sendCommand: () => console.warn("WebSocket not initialized yet"), 
  
  setIsConnected: (status) => set({ isConnected: status }),
  updateSystemStats: (cpu, memory) => set({ cpu, memory }),
  setActiveTask: (task) => set({ activeTask: task }),
  setDetectedGesture: (gesture) => set({ detectedGesture: gesture }),
  
  setVoiceProcessing: (status) => set({ isProcessingVoice: status }),
  clearVoiceData: () => set({ transcript: '', intent: null }),
  
  // This automatically TURNS OFF the loading spinner when data arrives!
  setVoiceData: (transcript, intent) => set({ 
    transcript, 
    intent, 
    activeTask: intent?.action || 'Idle',
    isProcessingVoice: false 
  }),
  
  setSendCommand: (fn) => set({ sendCommand: fn }),
}));