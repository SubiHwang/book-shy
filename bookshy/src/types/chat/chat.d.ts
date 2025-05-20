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
  type: 'EXCHANGE' | 'RENTAL';
  userIds: number[];
  bookAId: number;
  bookBId: number;
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

export type CalendarType = 'EXCHANGE' | 'RENTAL';

export interface ChatCalendarEventDto {
  eventId: number;
  requestId: number;
  roomId: number;
  type: CalendarType;
  title: string;
  description: string | null;
  eventDate?: string; // type === 'EXCHANGE'일 때만 존재
  startDate?: string; // type === 'RENTAL'일 때만 존재
  endDate?: string; // type === 'RENTAL'일 때만 존재
}

export interface ChatRoomUserIds {
  userAId: number;
  userBId: number;
}
