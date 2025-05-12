import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { CompatClient, IMessage, Stomp } from '@stomp/stompjs';

const SOCKET_URL = 'https://k12d204.p.ssafy.io:8080/ws-chat';

interface WebSocketContextValue {
  subscribeRoom: (
    roomId: number,
    onMessage: (msg: IMessage) => void,
  ) => { unsubscribe: () => void } | null;
  unsubscribe: (sub: { unsubscribe: () => void } | null) => void;
  sendMessage: (roomId: number, senderId: number, content: string, type: string) => void;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export const WebSocketProvider: React.FC<React.PropsWithChildren<object>> = ({ children }) => {
  const clientRef = useRef<CompatClient | null>(null);
  const subscriptions = useRef<Map<string, ReturnType<CompatClient['subscribe']>>>(new Map());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = new SockJS(SOCKET_URL);
    const client = Stomp.over(socket);
    client.debug = () => {};
    client.connect({}, () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
    });
    clientRef.current = client;

    return () => {
      client.disconnect(() => {
        console.log('🔌 WebSocket disconnected');
      });
      subscriptions.current.forEach((sub, topic) => {
        sub.unsubscribe();
        console.log(`❌ Cleaned up subscription to ${topic}`);
      });
      subscriptions.current.clear();
    };
  }, []);

  const subscribeRoom = useCallback((roomId: number, onMessage: (message: IMessage) => void) => {
    const topic = `/topic/chat/${roomId}`;
    const client = clientRef.current;

    if (!client?.connected) {
      console.warn('🛑 WebSocket not connected yet. Delaying subscription.');
      return null;
    }

    if (subscriptions.current.has(topic)) {
      console.log(`🟡 Already subscribed to ${topic}`);
      return {
        unsubscribe: () => {
          subscriptions.current.get(topic)?.unsubscribe();
          subscriptions.current.delete(topic);
          console.log(`❌ Unsubscribed from ${topic}`);
        },
      };
    }

    const sub = client.subscribe(topic, (frame) => {
      onMessage(frame);
    });

    subscriptions.current.set(topic, sub);
    console.log(`✅ Subscribed to ${topic}`);

    return {
      unsubscribe: () => {
        sub.unsubscribe();
        subscriptions.current.delete(topic);
        console.log(`❌ Unsubscribed from ${topic}`);
      },
    };
  }, []);

  const unsubscribe = useCallback((sub: { unsubscribe: () => void } | null) => {
    if (sub) sub.unsubscribe();
  }, []);

  const sendMessage = useCallback(
    (roomId: number, senderId: number, content: string, type = 'chat') => {
      if (!clientRef.current?.connected) return;

      const payload = {
        chatRoomId: roomId,
        senderId,
        content,
        type,
      };

    clientRef.current.send('/app/chat.send', {}, JSON.stringify(payload));
  }, []);

  return (
    <WebSocketContext.Provider value={{ subscribeRoom, unsubscribe, sendMessage, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error('useWebSocket must be used within WebSocketProvider');
  return ctx;
};
