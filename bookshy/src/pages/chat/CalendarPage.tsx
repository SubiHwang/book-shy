import { useEffect, useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAxiosInstance } from '@/services/axiosInstance';
import Header from '@/components/common/Header';

interface CalendarEventDto {
  eventId: number;
  requestId: number;
  type: 'EXCHANGE' | 'RENTAL';
  title: string;
  description?: string;
  eventDate?: string;
  startDate?: string;
  endDate?: string;
}

const ChatSchedulePage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEventDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await authAxiosInstance.get<CalendarEventDto[]>('/chats/calendar');
        setEvents(response.data);
      } catch (error) {
        console.error('❌ 일정 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="내 일정 보기" onBackClick={handleBack} />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CalendarIcon size={20} /> 내 거래 일정
        </h2>
        {loading ? (
          <p>로딩 중...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-500">등록된 일정이 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => (
              <li
                key={event.eventId}
                className="p-4 rounded-lg bg-white shadow-sm border border-gray-200"
              >
                <div className="text-sm text-gray-500">
                  {event.type === 'EXCHANGE' ? '📗 교환 일정' : '📘 대여 일정'}
                </div>
                <div className="text-lg font-medium text-gray-800">{event.title}</div>
                {event.description && (
                  <div className="text-sm text-gray-600 mt-1">{event.description}</div>
                )}
                <div className="text-sm text-gray-500 mt-2">
                  {event.eventDate
                    ? new Date(event.eventDate).toLocaleString('ko-KR')
                    : `${new Date(event.startDate!).toLocaleDateString('ko-KR')} ~ ${new Date(
                        event.endDate!,
                      ).toLocaleDateString('ko-KR')}`}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatSchedulePage;
