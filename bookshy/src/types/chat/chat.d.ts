export interface ChatRoomSummary {
  roomId: number;
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
  timestamp: string;
  type?: 'notice' | 'info' | 'warning';
}
