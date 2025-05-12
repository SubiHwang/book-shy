import { Client } from '@stomp/stompjs';

export const client = new Client({
  brokerURL: 'ws://k12d204.p.ssafy.io:8080', // 서버 배포 후 URL 변경 필요
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  onConnect: () => {
    console.log('📡 WebSocket 연결됨');
  },
  onStompError: (frame) => {
    console.error('❌ STOMP 오류:', frame);
  },
  onWebSocketError: (event) => {
    console.error('❌ WebSocket 자체 오류:', event);
  },
  onDisconnect: () => {
    console.warn('⚠️ WebSocket 연결 종료됨');
  },
});

client.activate();
