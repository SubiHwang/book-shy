import { useEffect, useRef } from 'react';
import { useWebSocket } from '@/contexts/WebSocketProvider';
import type { ChatMessage } from '@/types/chat/chat.ts';
import { IMessage } from '@stomp/stompjs';

export const useStomp = (roomId: number, onMessage: (msg: ChatMessage) => void) => {
  const { subscribeRoom, unsubscribe, sendMessage: sendWS, isConnected } = useWebSocket();

  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  useEffect(() => {
    if (!isConnected || !roomId) return;

    const sub = subscribeRoom(roomId, (frame: IMessage) => {
      try {
        const payload = JSON.parse(frame.body) as ChatMessage;
        onMessage(payload);
      } catch (e) {
        console.error('❌ STOMP 메시지 파싱 실패', e);
      }
    });

    subscriptionRef.current = sub;

    return () => {
      unsubscribe(subscriptionRef.current);
      subscriptionRef.current = null;
    };
  }, [roomId, isConnected, subscribeRoom, unsubscribe, onMessage]);

  const sendMessage = (
    roomId: number,
    content: string,
    type: string = 'chat',
  ) => {
    sendWS(roomId, content, type);
  };

  return { sendMessage };
};
