import { ChatRoomSummary } from '@/types/chat/chat';
import { authAxiosInstance } from '@/services/axiosInstance';

export async function fetchChatList(userId: number): Promise<ChatRoomSummary[]> {
  return await authAxiosInstance.get(`/chats?userId=${userId}`);
}