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
  id: number;
  chatRoomId: number;
  senderId: number;
  content: string | null;
  imageUrl?: string;
  thumbnailUrl?: string;
  type: 'text' | 'image' | 'notice' | 'info';
  timestamp: string;
  isRead: boolean;
  emoji?: string;
  sentAt?: string;
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
  exchangeDate?: string;
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
  calendarId: number;
  requestId: number;
  roomId: number;
  type: CalendarType;
  title: string;
  description: string | null;
  exchangeDate?: string; // type === 'EXCHANGE'일 때만 존재
  rentalStartDate?: string; // type === 'RENTAL'일 때만 존재
  rentalEndDate?: string; // type === 'RENTAL'일 때만 존재
}

export interface ChatRoomUserIds {
  userAId: number;
  userBId: number;
}
