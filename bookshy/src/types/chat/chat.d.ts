export interface ChatRoomSummary {
  id: number;
  partnerName: string;
  partnerProfileImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  bookshyScore: number;
  myBookId?: number[];
  myBookName?: string[];
  otherBookId?: number[];
  otherBookName?: string[];
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
  read?: boolean;
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

export interface EmojiUpdatePayload {
  messageId: number;
  emoji: string;
  type: 'ADD' | 'REMOVE';
  updatedBy: number;
}
