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
  senderId: string;
  content: string;
  sentAt: string;
  type?: 'notice' | 'info' | 'warning';
  emoji?: string;
}
