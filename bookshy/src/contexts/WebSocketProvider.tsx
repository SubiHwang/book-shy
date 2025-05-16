import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { CompatClient, IMessage, Stomp } from '@stomp/stompjs';
import { ChatMessage, EmojiUpdatePayload, ReadPayload } from '@/types/chat/chat';

const SOCKET_URL = 'https://k12d204.p.ssafy.io/ws-chat';

interface WebSocketContextValue {
  subscribeRoom: (
    roomId: number,
    onMessage: (msg: IMessage) => void,
  ) => { unsubscribe: () => void } | null;
  subscribeUser: (
    userId: number,
    onMessage: (msg: ChatMessage) => void,
  ) => { unsubscribe: () => void } | null;
  subscribeReadTopic: (
    roomId: number,
    onRead: (payload: ReadPayload) => void,
  ) => { unsubscribe: () => void } | null;
  subscribeCalendarTopic: (
    roomId: number,
    onCalendar: (payload: any) => void,
  ) => { unsubscribe: () => void } | null;
  subscribeEmojiTopic: (
    roomId: number,
    onEmojiUpdate: (payload: EmojiUpdatePayload) => void,
  ) => { unsubscribe: () => void } | null;
  unsubscribe: (sub: { unsubscribe: () => void } | null) => void;
  sendMessage: (roomId: number, senderId: number, content: string, type: string) => void;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export const WebSocketProvider: React.FC<React.PropsWithChildren<object>> = ({ children }) => {
  const clientRef = useRef<CompatClient | null>(null);
  const subscriptions = useRef<Map<string, { topic: string; callback: (frame: IMessage) => void }>>(
    new Map(),
  );
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    const socket = new SockJS(SOCKET_URL);
    const client = Stomp.over(socket);
    client.heartbeatIncoming = 10000;
    client.heartbeatOutgoing = 10000;
    client.debug = () => {};

    client.connect(
      {},
      () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        subscriptions.current.forEach(({ topic, callback }) => {
          subscriptions.current.set(topic, { topic, callback });
          console.log(`🔄 Re-subscribed to ${topic}`);
        });
      },
      (error: any) => {
        console.error('❌ WebSocket connect error:', error);
        setTimeout(connect, 5000);
      },
    );

    client.onWebSocketClose = () => {
      console.warn('⚠️ WebSocket closed, attempting reconnect...');
      setIsConnected(false);
      setTimeout(connect, 5000);
    };

    clientRef.current = client;
  }, []);

  useEffect(() => {
    connect();
    return () => {
      clientRef.current?.disconnect(() => console.log('🔌 WebSocket disconnected'));
      subscriptions.current.clear();
    };
  }, [connect]);

  const subscribe = useCallback((topic: string, callback: (frame: IMessage) => void) => {
    const client = clientRef.current;
    if (!client?.connected) {
      console.warn(`🛑 WebSocket not connected yet. Delaying subscription to ${topic}`);
      return null;
    }
    if (subscriptions.current.has(topic)) {
      console.log(`🟡 Already subscribed to ${topic}`);
      return {
        unsubscribe: () => {
          client.unsubscribe(topic);
          subscriptions.current.delete(topic);
        },
      };
    }
    const sub = client.subscribe(topic, callback);
    subscriptions.current.set(topic, { topic, callback });
    console.log(`✅ Subscribed to ${topic}`);
    return {
      unsubscribe: () => {
        sub.unsubscribe();
        subscriptions.current.delete(topic);
        console.log(`❌ Unsubscribed from ${topic}`);
      },
    };
  }, []);

  const subscribeRoom = useCallback(
    (roomId: number, onMessage: (msg: IMessage) => void) => {
      return subscribe(`/topic/chat/${roomId}`, onMessage);
    },
    [subscribe],
  );

  const subscribeUser = useCallback(
    (userId: number, onMessage: (message: ChatMessage) => void) => {
      return subscribe(`/topic/chat/user/${userId}`, (frame) => {
        try {
          const msg = JSON.parse(frame.body);
          onMessage(msg);
        } catch (e) {
          console.error('❌ User message parsing failed', e);
        }
      });
    },
    [subscribe],
  );

  const subscribeReadTopic = useCallback(
    (roomId: number, onRead: (payload: ReadPayload) => void) => {
      return subscribe(`/topic/read/${roomId}`, (frame) => {
        try {
          const payload = JSON.parse(frame.body);
          onRead(payload);
        } catch (e) {
          console.error('❌ 읽음 메시지 파싱 실패', e);
        }
      });
    },
    [subscribe],
  );

  const subscribeCalendarTopic = useCallback(
    (roomId: number, onCalendar: (payload: any) => void) => {
      return subscribe(`/topic/calendar/${roomId}`, (frame) => {
        try {
          const payload = JSON.parse(frame.body);
          onCalendar(payload);
        } catch (e) {
          console.error('❌ Calendar message parsing failed', e);
        }
      });
    },
    [subscribe],
  );

  const subscribeEmojiTopic = useCallback(
    (roomId: number, onEmojiUpdate: (payload: EmojiUpdatePayload) => void) => {
      return subscribe(`/topic/chat/emoji/${roomId}`, (frame) => {
        try {
          const payload = JSON.parse(frame.body);
          onEmojiUpdate(payload);
        } catch (e) {
          console.error('❌ Emoji message parsing failed', e);
        }
      });
    },
    [subscribe],
  );

  const unsubscribe = useCallback((sub: { unsubscribe: () => void } | null) => {
    if (sub) sub.unsubscribe();
  }, []);

  const sendMessage = useCallback(
    (roomId: number, senderId: number, content: string, type = 'chat') => {
      if (!clientRef.current?.connected) return;
      const payload = { chatRoomId: roomId, senderId, content, type };
      clientRef.current.send('/app/chat.send', {}, JSON.stringify(payload));
    },
    [],
  );

  return (
    <WebSocketContext.Provider
      value={{
        subscribeRoom,
        subscribeUser,
        subscribeReadTopic,
        subscribeCalendarTopic,
        subscribeEmojiTopic,
        unsubscribe,
        sendMessage,
        isConnected,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error('useWebSocket must be used within WebSocketProvider');
  return ctx;
};
