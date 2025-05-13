export interface ChatRoomSummary {
  id: number;
  partnerName: string;
  partnerProfileImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  chatRoomId?: number;
  senderId: number;
  senderNickname?: string;
  content: string;
  sentAt: string;
  type?: 'notice' | 'info' | 'warning' | 'text';
  emoji?: string;
  isRead?: boolean;
}

export interface RegisterSchedulePayload {
  roomId: number;
  requestId: number;
  type: 'EXCHANGE' | 'RENTAL';
  title: string;
  description?: string;
  eventDate?: string;
  startDate?: string;
  endDate?: string;
}

interface ReadPayload {
  messageIds: number[];
  readerId: number;
}
