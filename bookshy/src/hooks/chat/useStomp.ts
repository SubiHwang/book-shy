import { useEffect, useRef } from 'react';
import { useWebSocket } from '@/contexts/WebSocketProvider';
import type { ChatMessage, ReadPayload } from '@/types/chat/chat';
import { IMessage } from '@stomp/stompjs';

export const useStomp = (
  roomId: number,
  onMessage: (msg: ChatMessage) => void,
  onRead?: (payload: ReadPayload) => void,
) => {
  const {
    subscribeRoom,
    subscribeReadTopic,
    unsubscribe,
    sendMessage: sendWS,
    isConnected,
  } = useWebSocket();

  const roomSubRef = useRef<{ unsubscribe: () => void } | null>(null);
  const readSubRef = useRef<{ unsubscribe: () => void } | null>(null);

  useEffect(() => {
    if (!isConnected || !roomId) return;

    roomSubRef.current = subscribeRoom(roomId, (frame: IMessage) => {
      try {
        const payload = JSON.parse(frame.body) as ChatMessage;
        onMessage(payload);
      } catch (e) {
        console.error('❌ 메시지 파싱 실패', e);
      }
    });

    readSubRef.current = subscribeReadTopic(roomId, (payload: ReadPayload) => {
      onRead?.(payload);
    });

    return () => {
      unsubscribe(roomSubRef.current);
      unsubscribe(readSubRef.current);
    };
  }, [roomId, isConnected, onMessage, onRead, subscribeRoom, subscribeReadTopic, unsubscribe]);

  const sendMessage = (
    roomId: number,
    senderId: number,
    content: string,
    type: string = 'chat',
  ) => {
    sendWS(roomId, senderId, content, type);
  };

  return { sendMessage };
};
