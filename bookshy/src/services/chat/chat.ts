import { ChatMessage, ChatRoomSummary } from '@/types/chat/chat';
import { authAxiosInstance } from '@/services/axiosInstance';

export async function fetchChatList(userId: number): Promise<ChatRoomSummary[]> {
  return await authAxiosInstance.get(`/chats?userId=${userId}`);
}

export async function fetchMessages(chatRoomId: number): Promise<ChatMessage[]> {
  return await authAxiosInstance.get(`/messages?roomId=${chatRoomId}`);
}

export async function markMessagesAsRead(chatRoomId: number, userId: number): Promise<void> {
  await authAxiosInstance.post(`/messages/${chatRoomId}/read?userId=${userId}`);
}
