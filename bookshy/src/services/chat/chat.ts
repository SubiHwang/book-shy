import {
  ChatMessage,
  ChatRoomSummary,
  RegisterSchedulePayload,
  ChatCalendarEventDto,
  ChatRoomUserIds,
} from '@/types/chat/chat';
import { Book } from '@/types/book/book';
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

// ✅ 채팅방 참여자 ID 조회
export async function fetchChatRoomUserIds(chatRoomId: number): Promise<ChatRoomUserIds> {
  return await authAxiosInstance.get(`/chats/${chatRoomId}/participants`);
}

// ✅ 현재 로그인 사용자가 대여 중인 모든 도서 목록 조회
export async function fetchRentalBooksInUse(): Promise<Book[]> {
  const { data } = await authAxiosInstance.get(`/chats/rental-books`);
  return data;
}

// ✅ 채팅 이미지 업로드
export async function uploadChatImage(
  chatRoomId: number,
  file: File,
): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append('file', file);

  return await authAxiosInstance.post(`/messages/image?chatRoomId=${chatRoomId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function fetchPartnerInfo(
  roomId: number,
): Promise<{ name: string; profileImage: string; bookShyScore: number }> {
  const res = await authAxiosInstance.get(`/chats/${roomId}/opponent`);
  const data = res.data ? res.data : res; // data가 있으면 data, 없으면 res 자체
  return {
    name: data.nickname,
    profileImage: data.profileImageUrl,
    bookShyScore: data.temperature,
  };
}
