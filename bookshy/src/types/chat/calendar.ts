export type CalendarEventType = 'EXCHANGE' | 'RENTAL';

export interface CreateCalendarEventRequest {
  roomId: number;
  type: CalendarEventType;
  userIds: number[];
  bookAId: number;
  bookBId: number;
  title: string;
  description?: string;
  eventDate?: string; // ISO-8601 format
  startDate?: string; // ISO-8601 format
  endDate?: string; // ISO-8601 format
}

export interface CalendarEventResponse {
  eventId: number;
  status: 'SUCCESS' | 'FAIL';
  message: string;
}

export interface ChatCalendarEventDto {
  eventId: number;
  roomId: number;
  requestId: number;
  type: CalendarEventType;
  title: string;
  description?: string;
  eventDate?: string;
  startDate?: string;
  endDate?: string;
}
