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
}
