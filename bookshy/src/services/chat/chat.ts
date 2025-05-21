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
export const uploadChatImage = async (chatRoomId: number, file: File) => {
  // 파일 크기 제한 (5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('파일 크기는 5MB를 초과할 수 없습니다.');
  }

  // 허용된 이미지 타입
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('지원하지 않는 이미지 형식입니다. (JPEG, PNG, GIF만 가능)');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await authAxiosInstance.post(
      `/messages/image?chatRoomId=${chatRoomId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        maxBodyLength: MAX_FILE_SIZE,
        maxContentLength: MAX_FILE_SIZE,
      },
    );
    return response.data;
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    throw error;
  }
};

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

export const deleteScheduleByRoomId = async (roomId: number) => {
  const { data } = await authAxiosInstance.delete(`/chat/calendar/${roomId}`);
  return data;
};
