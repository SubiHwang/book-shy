import {
  ChatMessage,
  ChatRoomSummary,
  RegisterSchedulePayload,
  ChatCalendarEventDto,
} from '@/types/chat/chat';
import { authAxiosInstance } from '@/services/axiosInstance';

export async function fetchChatList(): Promise<ChatRoomSummary[]> {
  return await authAxiosInstance.get(`/chats`);
}

export async function fetchMessages(chatRoomId: number): Promise<ChatMessage[]> {
  return await authAxiosInstance.get(`/messages?roomId=${chatRoomId}`);
}

export async function markMessagesAsRead(chatRoomId: number): Promise<void> {
  await authAxiosInstance.post(`/messages/${chatRoomId}/read`);
}

export async function sendEmoji(messageId: number, emoji: string) {
  await authAxiosInstance.post(`/messages/${messageId}/emoji`, { emoji });
}

export async function registerSchedule(payload: RegisterSchedulePayload): Promise<void> {
  await authAxiosInstance.post('/chats/calendar', payload);
}

export async function deleteEmoji(messageId: number): Promise<void> {
  await authAxiosInstance.delete(`/messages/${messageId}/emoji`);
}

// 채팅방의 거래 일정 가져오기
export async function fetchScheduleByRoomId(roomId: number): Promise<ChatCalendarEventDto> {
  return await authAxiosInstance.get(`/chats/calendar?roomId=${roomId}`);
}
