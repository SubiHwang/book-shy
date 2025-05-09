import { ChatMessage, ChatRoomSummary, RegisterSchedulePayload } from '@/types/chat/chat';
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

export async function sendEmoji(messageId: number, emoji: string) {
  await authAxiosInstance.post(`/messages/${messageId}/emoji`, { emoji });
}

export async function registerSchedule(payload: RegisterSchedulePayload): Promise<void> {
  await authAxiosInstance.post('/chats/calendar', payload);
}
