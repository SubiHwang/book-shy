import { FC, useState } from 'react';
import { X } from 'lucide-react';
import TimePickerModal from './TimePickerModal';
import { RegisterSchedulePayload } from '@/types/chat/chat';

interface Props {
  partnerName: string;
  partnerProfileImage: string;
  roomId: number;
  requestId: number;
  onClose: () => void;
  onConfirm: (message: string, payload: RegisterSchedulePayload) => void;
}

const ScheduleModal: FC<Props> = ({
  partnerName,
  partnerProfileImage,
  onClose,
  onConfirm,
  roomId,
  requestId,
}) => {
  const today = new Date();
  const [tab, setTab] = useState<'대여' | '교환'>('대여');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [showTimePickerFor, setShowTimePickerFor] = useState<'대여' | '반납' | null>(null);
  const [borrowTime, setBorrowTime] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const startDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const handleDateClick = (day: string) => {
    if (tab === '교환') {
      setStartDate(day);
      setEndDate(null);
    } else {
      if (!startDate || (startDate && endDate)) {
        setStartDate(day);
        setEndDate(null);
      } else if (startDate && !endDate) {
        if (day < startDate) {
          setEndDate(startDate);
          setStartDate(day);
        } else {
          setEndDate(day);
        }
      }
    }
  };

  const goPrevMonth = () => {
    if (month === 0) {
      setYear((prev) => prev - 1);
      setMonth(11);
    } else {
      setMonth((prev) => prev - 1);
    }
    setStartDate(null);
    setEndDate(null);
  };

  const goNextMonth = () => {
    if (month === 11) {
      setYear((prev) => prev + 1);
      setMonth(0);
    } else {
      setMonth((prev) => prev + 1);
    }
    setStartDate(null);
    setEndDate(null);
  };

  const handleComplete = () => {
    if (!startDate || !borrowTime || (tab === '대여' && (!returnTime || !endDate))) {
      alert('날짜와 시간을 모두 선택해주세요');
      return;
    }

    const formatFullDate = (day: string) => {
      const date = new Date(year, month, parseInt(day));
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const toISOString = (day: string, time: string): string => {
      const regex = /(오전|오후)\s(\d{2})시\s(\d{2})분/;
      const match = time.match(regex);
      if (!match) throw new Error('Invalid time format');

      let hour = parseInt(match[2], 10);
      const minute = parseInt(match[3], 10);
      if (match[1] === '오후' && hour !== 12) hour += 12;
      if (match[1] === '오전' && hour === 12) hour = 0;

      const date = new Date(year, month, parseInt(day), hour, minute);

      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const hh = String(date.getHours()).padStart(2, '0');
      const mi = String(date.getMinutes()).padStart(2, '0');

      return `${yyyy}-${mm}-${dd}T${hh}:${mi}:00`;
    };

    const msg = `${formatFullDate(startDate)} ${borrowTime}`;
    const payload: RegisterSchedulePayload =
      tab === '교환'
        ? {
            roomId,
            requestId,
            type: 'EXCHANGE',
            title: msg,
            eventDate: toISOString(startDate, borrowTime),
          }
        : {
            roomId,
            requestId,
            type: 'RENTAL',
            title: msg,
            startDate: toISOString(startDate, borrowTime),
            endDate: toISOString(endDate!, returnTime!),
          };

    onConfirm(msg, payload);
    onClose();
  };

  const isCompleteDisabled =
    !startDate || !borrowTime || (tab === '대여' && (!returnTime || !endDate));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-[#FFFCF9] rounded-2xl p-4 w-[360px] shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img src={partnerProfileImage} className="w-8 h-8 rounded-full" />
            <span className="font-semibold text-sm">{partnerName}님과 약속을 잡을게요.</span>
          </div>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="flex mb-3 border-b">
          {['책 대여 하기', '책 교환 하기'].map((label, idx) => (
            <button
              key={label}
              onClick={() => {
                setTab(idx === 0 ? '대여' : '교환');
                setStartDate(null);
                setEndDate(null);
              }}
              className={`flex-1 py-2 text-sm font-medium ${
                tab === (idx === 0 ? '대여' : '교환')
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium mb-1">
            🗓️ {tab === '대여' ? '대여 기간 선택' : '교환 날짜 선택'}
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <button onClick={goPrevMonth} className="text-gray-500 text-sm px-2">
                ◀
              </button>
              <div className="text-sm font-semibold text-gray-700">
                {year}년 {month + 1}월
              </div>
              <button onClick={goNextMonth} className="text-gray-500 text-sm px-2">
                ▶
              </button>
            </div>

            <div className="grid grid-cols-7 text-xs text-gray-400 text-center mb-2">
              {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: lastDate }).map((_, i) => {
                const day = i + 1;
                const padded = String(day).padStart(2, '0');
                const date = new Date(year, month, day);
                const isPast =
                  date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const isToday =
                  date.getFullYear() === today.getFullYear() &&
                  date.getMonth() === today.getMonth() &&
                  date.getDate() === today.getDate();

                const isStart = startDate === padded;
                const isEnd = endDate === padded;
                const inRange = startDate && endDate && padded > startDate && padded < endDate;

                return (
                  <button
                    key={padded}
                    onClick={() => !isPast && handleDateClick(padded)}
                    className={`
                      p-2 rounded-full transition-all
                      ${isPast ? 'text-gray-300 cursor-not-allowed' : ''}
                      ${isStart || isEnd ? 'bg-primary text-white font-bold' : ''}
                      ${inRange ? 'bg-pink-100 text-primary' : ''}
                      ${isToday ? 'border border-primary font-semibold' : ''}
                      ${!isPast && !isStart && !isEnd && !inRange && !isToday ? 'text-gray-700' : ''}
                    `}
                    disabled={isPast}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label className="text-sm text-gray-700 font-medium">
            ⏰ {tab === '대여' ? '대여 시간' : '교환 시간'}
          </label>
          <div
            className="w-full mt-1 px-4 py-2 bg-white rounded-lg border border-gray-300 text-gray-500 cursor-pointer"
            onClick={() => setShowTimePickerFor('대여')}
          >
            {borrowTime || '시간을 선택해주세요'}
          </div>
        </div>

        {tab === '대여' && (
          <div className="mb-4">
            <label className="text-sm text-gray-700 font-medium">⏰ 반납 시간</label>
            <div
              className="w-full mt-1 px-4 py-2 bg-white rounded-lg border border-gray-300 text-gray-500 cursor-pointer"
              onClick={() => setShowTimePickerFor('반납')}
            >
              {returnTime || '시간을 선택해주세요'}
            </div>
          </div>
        )}

        <button
          onClick={handleComplete}
          disabled={isCompleteDisabled}
          className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors
            ${isCompleteDisabled ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-primary text-white'}`}
        >
          완료
        </button>
      </div>

      {showTimePickerFor && (
        <TimePickerModal
          onClose={() => setShowTimePickerFor(null)}
          onConfirm={(time) => {
            if (showTimePickerFor === '대여') setBorrowTime(time);
            else setReturnTime(time);
            setShowTimePickerFor(null);
          }}
        />
      )}
    </div>
  );
};

export default ScheduleModal;
