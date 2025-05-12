import { useEffect, useRef } from 'react';
import { useWebSocket } from '@/contexts/WebSocketProvider';
import type { ChatMessage } from '@/types/chat/chat';
import { IMessage } from '@stomp/stompjs';

interface ReadPayload {
  messageIds: number[];
  readerId: number;
}

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

    // 메시지 수신 구독
    roomSubRef.current = subscribeRoom(roomId, (frame: IMessage) => {
      try {
        const payload = JSON.parse(frame.body) as ChatMessage;
        onMessage(payload);
      } catch (e) {
        console.error('❌ STOMP 메시지 파싱 실패', e);
      }
    });

    // 읽음 수신 구독
    readSubRef.current = subscribeReadTopic(roomId, (frame: IMessage) => {
      try {
        const payload = JSON.parse(frame.body) as ReadPayload;
        onRead?.(payload);
      } catch (e) {
        console.error('❌ 읽음 메시지 파싱 실패', e);
      }
    });

    return () => {
      unsubscribe(roomSubRef.current);
      unsubscribe(readSubRef.current);
      roomSubRef.current = null;
      readSubRef.current = null;
    };
  }, [roomId, isConnected, subscribeRoom, subscribeReadTopic, unsubscribe, onMessage, onRead]);

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
