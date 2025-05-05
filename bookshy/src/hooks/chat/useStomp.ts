import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';

const SOCKET_URL = 'http://k12d204.p.ssafy.io:8080';

export const useStomp = (
  chatRoomId: number,
  onMessage: (message: any) => void
) => {
  const clientRef = useRef<CompatClient | null>(null);

  useEffect(() => {
    const socket = new SockJS(SOCKET_URL);
    const stompClient = Stomp.over(socket);
    clientRef.current = stompClient;

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/chat/${chatRoomId}`, (message) => {
        const payload = JSON.parse(message.body);
        onMessage(payload);
      });
    });

    return () => {
      stompClient.disconnect(() => {
        console.log('Disconnected');
      });
    };
  }, [chatRoomId]);

  const sendMessage = (chatRoomId: number, senderId: number, content: string) => {
    if (!clientRef.current || !clientRef.current.connected) return;

    const payload = {
      chatRoomId,
      senderId,
      content,
    };

    clientRef.current.send('/app/chat.send', {}, JSON.stringify(payload));
  };

  return { sendMessage };
};