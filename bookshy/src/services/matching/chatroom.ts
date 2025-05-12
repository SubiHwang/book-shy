import { CreateChatRoomReq, CreateChatRoomRes } from '@/types/Matching';
import { authAxiosInstance } from '@/services/axiosInstance';

export async function createChatRoom(body: CreateChatRoomReq): Promise<CreateChatRoomRes> {
  const resp = await authAxiosInstance.post<CreateChatRoomRes>('/chats', body);
  console.log('resp', resp);
  return resp.data;
}
