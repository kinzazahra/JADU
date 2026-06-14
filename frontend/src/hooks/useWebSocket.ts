import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAgentStore } from '@/store/useAgentStore';

export function useWebSocket() {
  const { user } = useAuthStore();
  const ws = useRef<WebSocket | null>(null);
  const { setIsConnected, updateSystemStats, setVoiceData, setDetectedGesture, setSendCommand } = useAgentStore();

  const sendCommand = useCallback((action: string, payload: any = {}) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ action, ...payload }));
    }
  }, []);

  const connect = useCallback(() => {
    if (!user?.uid) return;
    if (ws.current?.readyState === WebSocket.OPEN) return;

    const wsUrl = `ws://127.0.0.1:8000/ws/${user.uid}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('JADU Neural Link Established');
      setIsConnected(true);
      setSendCommand(sendCommand); // Register command sender globally
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'system_status') {
          updateSystemStats(data.data.cpu, data.data.memory);
        } else if (data.type === 'voice_response') {
          setVoiceData(data.data.transcript, data.data.intent);
        } else if (data.type === 'gesture_response') {
          setDetectedGesture(data.data.gesture);
        } else if (data.type === 'browser_response') {
          // Handle browser agent feedback
          console.log("Browser Agent:", data.data);
        }
        
      } catch (err) {
        console.error('Failed to parse WS message:', err);
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      setTimeout(connect, 3000);
    };

  }, [user?.uid, setIsConnected, updateSystemStats, setVoiceData, setDetectedGesture, setSendCommand, sendCommand]);

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [connect]);

  return null; // Hook no longer needs to return anything directly
}