import { authAxiosInstance } from '@/services/axiosInstance';
import type { CreateCalendarEventRequest, CalendarEventResponse } from '@/types/chat/calendar';

export const createCalendarEvent = async (
  data: CreateCalendarEventRequest,
): Promise<CalendarEventResponse> => {
  const response = await authAxiosInstance.post<CalendarEventResponse>('/chats/calendar', data);
  return response as unknown as CalendarEventResponse;
};
