import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAgentStore } from '@/store/useAgentStore';

export function useWebSocket() {
  const user = useAuthStore((state) => state.user);
  const ws = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (!user?.uid) return;
    
    // BUG FIX: Prevent duplicate connections caused by React Strict Mode
    if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) {
      return; 
    }

    const wsUrl = `ws://127.0.0.1:8000/ws/${user.uid}`;
    console.log("🔌 Attempting to connect to:", wsUrl);
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('✅ JADU Neural Link Established');
      const store = useAgentStore.getState();
      store.setIsConnected(true);
      
      store.setSendCommand((action: string, payload: any = {}) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          console.log(`📤 Sending Command [${action}]:`, payload);
          ws.current.send(JSON.stringify({ action, ...payload }));
        } else {
          console.error("❌ Cannot send command: WebSocket is disconnected.");
        }
      });
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const store = useAgentStore.getState();
        
        // Log every message EXCEPT system_status (so we don't spam your console)
        if (data.type !== 'system_status') {
          console.log("📥 WS Message Received:", data);
        }
        
        if (data.type === 'system_status') {
          store.updateSystemStats(data.data.cpu, data.data.memory);
        } else if (data.type === 'voice_response') {
          console.log("🎙️ Voice Response Triggered! Updating UI...");
          // THIS is what puts the text on your screen and stops the spinner
          store.setVoiceData(data.data.transcript, data.data.intent);
        } else if (data.type === 'gesture_response') {
          store.setDetectedGesture(data.data.gesture);
        } else if (data.type === 'browser_response') {
          console.log("🌐 Browser Agent Update:", data.data);
        }
        
      } catch (err) {
        console.error('❌ Failed to parse WS message:', err);
      }
    };

    ws.current.onclose = (event) => {
      console.warn('⚠️ JADU Neural Link Disconnected.', event.reason);
      const store = useAgentStore.getState();
      store.setIsConnected(false);
      
      // FAILSAFE: Turn off loading spinners if the connection drops!
      store.setVoiceProcessing(false); 
      
      ws.current = null;
      setTimeout(connect, 3000); // Auto-reconnect
    };

    ws.current.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
    };

  }, [user?.uid]);

  useEffect(() => {
    connect();
    return () => {
      // Clean up properly when navigating away from the dashboard
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [connect]);

  return null;
}